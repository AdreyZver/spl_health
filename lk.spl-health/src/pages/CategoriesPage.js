import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Text } from "@consta/uikit/Text";
import { RightSideContent } from "../components/Categories/RightSideContent/RightSideContent";
import { LeftSideContent } from "../components/Categories/LeftSideContent/LeftSideContent";

import styles from './CategoriesPage.module.css';

export const CategoriesPage = () => {

  const { categoryId, programId } = useParams();
  const [activeCategory, setActiveCategory] = useState(null);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  }

  return (
    <div className={styles.wrapper}>
      <Text as="h1" size="4xl">Категории</Text>
      <div className={styles.content}>
        <LeftSideContent
          activeCategory={activeCategory}
          onCategorySelect={handleCategoryChange}
          paramsSelectedCategoryId={categoryId}
        />
        <RightSideContent
          activeCategory={activeCategory}
          paramsSelectedProgramId={programId}
        />
      </div>
    </div>
  );
}
