import { useEffect, useState } from "react";
import { CategoriesAPI, OrganizationAPI } from "../../../../../app/API/api";
import { toast } from "react-toastify";
import { Button } from "@consta/uikit/Button";
import { Text } from "@consta/uikit/Text";
import { TextField } from "@consta/uikit/TextField";
import { Modal } from "@consta/uikit/Modal";
import { Select } from "@consta/uikit/Select";

import styles from "./CreateProgramButtonWithModal.module.css";

export const CreateProgramButtonWithModal = ({
  onCreate
}) => {

  const [isAddProgramModalOpen, setIsAddProgramModalOpen] = useState(false);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);
  const [isSubmitAddProgramLoading, setIsSubmitAddProgramLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState();
  const [newProgramName, setNewProgramName] = useState();
  const [newProgramDescription, setNewProgramDescription] = useState();

  const handleCreate = () => {
    setIsAddProgramModalOpen(false);
    toast.success('Программа добавлена');
    onCreate();
  }

  const submitAddProgram = async () => {
    setIsSubmitAddProgramLoading(true);

    try {
      await OrganizationAPI.createProgram({
        programName: newProgramName,
        programDescription: newProgramDescription,
        categoryId: activeCategory.id,
      });

      handleCreate();
    } catch (apiError) {
      const { response } = apiError;
      const { data } = response;

      toast.error(`${data.code}: ${data.message}`);
    }

    setIsSubmitAddProgramLoading(false);
  }

  const getAllCategories = async () => {
    setIsCategoriesLoading(true);

    try {
      const categories = await CategoriesAPI.getCategories();
      setCategories(categories.map((category) => ({ ...category, groupId: 1 })));
    } catch (apiError) {
      const { response } = apiError;
      const { data } = response;

      toast.error(`${data.code}: ${data.message}`);
    }

    setIsCategoriesLoading(false);
  }

  useEffect(() => {
    if (isAddProgramModalOpen) {
      getAllCategories();
    } else if (!isAddProgramModalOpen && categories.length) {
      setCategories([]);
    }
  }, [isAddProgramModalOpen]);

  const toggleModalOpen = (isOpen) => {
    setIsAddProgramModalOpen(isOpen);
  }

  const handleChangeActiveCategory = (category) => {
    setActiveCategory(category)
  }

  const handleNewProgramNameChange = (newProgramName) => {
    setNewProgramName(newProgramName);
  }

  const handleNewProgramDescriptionChange = (newProgramDescription) => {
    setNewProgramDescription(newProgramDescription);
  }

  const handleSubmitAddProgram = () => {
    submitAddProgram();
  }

  return (
    <>
      <Button
        label="Добавить курс"
        onClick={() => toggleModalOpen(true)}
      />
      <Modal
        isOpen={isAddProgramModalOpen}
        hasOverlay
        onClickOutside={() => toggleModalOpen(false)}
        onEsc={() => toggleModalOpen(false)}
        className={styles['add-modal']}
      >
        <div className={styles['add-modal-content']}>
          <Text
            weight="bold"
            size="xl"
            className={styles['add-modal-title']}
          >
            Добавить курс
          </Text>
          <TextField
            label="Название курса"
            value={newProgramName}
            onChange={({ value }) => handleNewProgramNameChange(value)}
            required
          />
          <Select
            label="Категория"
            labelForEmptyItems="Категории отсутствуют"
            items={categories}
            value={activeCategory}
            onChange={({ value }) => handleChangeActiveCategory(value)}
            getItemKey={(item) => item.id}
            getItemLabel={(item) => item.name}
            isLoading={isCategoriesLoading}
            required
          />
          <TextField
            label="Описание курса"
            value={newProgramDescription}
            onChange={({ value }) => handleNewProgramDescriptionChange(value)}
            type="textarea"
            rows={5}
            required
          />
          <Button
            label="Готово"
            onClick={handleSubmitAddProgram}
            className={styles['add-modal-submit']}
            disabled={!newProgramName || !activeCategory || !newProgramDescription}
            loading={isSubmitAddProgramLoading}
          />
        </div>
      </Modal>
    </>
  );
}