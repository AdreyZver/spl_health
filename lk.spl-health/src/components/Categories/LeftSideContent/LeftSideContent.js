import React, { useEffect, useState } from "react"
import { Tabs } from "@consta/uikit/Tabs"
import { toast } from "react-toastify";
import { SkeletonBrick } from "@consta/uikit/Skeleton";
import { CategoriesAPI } from "../../../app/API/api";

const getDefaultActiveCategory = (categories, activeCategoryId) => {
  if (activeCategoryId) {
    return categories.find((category) => category.id === +activeCategoryId);
  }

  return categories[0];
}

export const LeftSideContent = ({
  onCategorySelect,
  activeCategory,
  paramsSelectedCategoryId
}) => {

  const [categories, setCategories] = useState([]);
  const [isListLoading, setIsListLoading] = useState(false);

  const getCategories = async () => {
    setIsListLoading(true);

    try {
      const categories = await CategoriesAPI.getCategories();
      setCategories(categories);

      const defaultActiveCategory = getDefaultActiveCategory(categories, paramsSelectedCategoryId);

      onCategorySelect(defaultActiveCategory);
    } catch (apiError) {
      const { response } = apiError;
      const { data } = response;

      toast.error(`${data.code}: ${data.message}`);
    }
    setIsListLoading(false);
  }

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div>
      {isListLoading ? (
        <>
          <SkeletonBrick width="100%" height="200px" />
        </>
      ) : (
        <Tabs
          value={activeCategory}
          onChange={({ value }) => onCategorySelect(value)}
          items={categories}
          getItemLabel={(category) => category.name}
          linePosition="right"
        />
      )}
    </div>
  )
}