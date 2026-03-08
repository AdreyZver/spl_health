import { TextField } from "@consta/uikit/TextField";
import { useEffect, useState } from "react"
import { CategoriesAPI, OrganizationAPI } from "../../../../../../app/API/api";
import { toast } from "react-toastify";
import { Select } from "@consta/uikit/Select";

import styles from "./MainInfo.module.css";
import { Button } from "@consta/uikit/Button";

export const OrganizationProgramEditMainInfo = ({
  program,
  onUpdate
}) => {

  const [name, setName] = useState(program.name);
  const [categoryId, setCategoryId] = useState(program.category_id);
  const [description, setDescription] = useState(program.description);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const getAllCategories = async () => {
    setIsCategoriesLoading(true);

    try {
      const categories = await CategoriesAPI.getCategories();
      setCategories(categories);
    } catch (apiError) {
      const { response } = apiError;
      const { data } = response;

      toast.error(`${data.code}: ${data.message}`);
    }

    setIsCategoriesLoading(false);
  }

  const updateProgram = async () => {
    setIsSubmitLoading(true);

    try {
      await OrganizationAPI.updateProgram({
        programId: program.id,
        programName: name,
        programDescription: description,
        categoryId
      });

      toast.success('Программа обновлена');
      onUpdate({
        name,
        description,
        category_id: categoryId
      });
    } catch (apiError) {
      const { response } = apiError;
      const { data } = response;

      toast.error(`${data.code}: ${data.message}`);
    }

    setIsSubmitLoading(false);
  }

  useEffect(() => {
    getAllCategories();
  }, [])

  const handleChangeName = (name) => {
    setName(name);
  }

  const handleChangeDescription = (description) => {
    setDescription(description);
  }

  const handleChangeCategory = (category) => {
    setCategoryId(category.id);
  }

  const handleSubmit = () => {
    updateProgram();
  }

  const isFieldsValid = () => {
    return name && description && categoryId;
  }

  const isFieldDifferents = () => {
    return name !== program.name ||
      description !== program.description ||
      +categoryId !== +program.category_id
  }

  const isSubmitButtonDisabled = !isFieldsValid() || !isFieldDifferents() || isSubmitLoading;

  return (
    <div className={styles.form}>
      <TextField
        required
        disabled={!!program.deleted_at}
        label="Название курса"
        status={!name && "alert"}
        value={name}
        onChange={({ value }) => handleChangeName(value)}
      />
      <Select
        label="Категория"
        labelForEmptyItems="Категории отсутствуют"
        items={categories}
        value={categories.find((category) => +category.id === +categoryId)}
        onChange={({ value }) => handleChangeCategory(value)}
        getItemKey={(item) => item.id}
        getItemLabel={(item) => item.name}
        isLoading={isCategoriesLoading}
        disabled={isCategoriesLoading || !!program.deleted_at}
        required
      />
      <TextField
        disabled={!!program.deleted_at}
        label="Описание курса"
        status={!description && "alert"}
        required
        value={description}
        onChange={({ value }) => handleChangeDescription(value)}
        type="textarea"
        rows={8}
      />
      <Button
        label="Обновить"
        onClick={handleSubmit}
        disabled={isSubmitButtonDisabled}
        className={styles['button-submit']}
        loading={isSubmitLoading}
      />
    </div>
  );
}