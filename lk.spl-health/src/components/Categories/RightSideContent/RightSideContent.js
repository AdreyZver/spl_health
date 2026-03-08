import React, { useEffect, useState } from "react";
import cn from 'classnames';
import { toast } from "react-toastify";
import { SkeletonBrick } from "@consta/uikit/Skeleton";
import { ProgramsAPI } from "../../../app/API/api";
import { ProgramCard } from "../ProgramCard/ProgramCard";
import { Program } from "../Program/Program";

import styles from './RightSideContent.module.css';

export const RightSideContent = ({
  activeCategory,
  paramsSelectedProgramId
}) => {

  const [programsList, setProgramsList] = useState([]);
  const [activeProgram, setActiveProgram] = useState(null);
  const [isListLoading, setIsListLoading] = useState(false);

  const getCategoryPrograms = async () => {
    setIsListLoading(true);
    setActiveProgram(null);

    try {
      const programs = await ProgramsAPI.getCategoryPrograms({
        categoryId: activeCategory.id
      });
      setProgramsList(programs);

      if (paramsSelectedProgramId) {
        setActiveProgram(programs.find((program) => program.id === +paramsSelectedProgramId));
      }
    } catch (apiError) {
      const { response } = apiError;
      const { data } = response;

      toast.error(`${data.code}: ${data.message}`);
    }

    setIsListLoading(false);
  }

  useEffect(() => {
    if (activeCategory?.id) {
      getCategoryPrograms();
    }
  }, [activeCategory]);

  const handleBackClick = () => {
    setActiveProgram(null);
  }

  const handleProgramClick = (program) => {
    setActiveProgram(program);
  }

  return (
    <div
      className={cn(
        styles.programs__list,
        activeProgram ? styles.programs__list_program : ''
      )}
    >
      {isListLoading || !activeCategory ? (
        <>
          {Array.apply(null, { length: 4 }).map((value, index) => (
            <SkeletonBrick
              key={`sceleton_${index}`}
              width="100%"
              height="100px"
            />
          ))}
        </>
      ) : (
        <>
          {activeProgram ? (
            <Program
              program={activeProgram}
              onBackClick={handleBackClick}
            />
          ) : (
            programsList?.map((program) => (
              <ProgramCard
                key={program.id}
                program={program}
                onCardClick={handleProgramClick}
              />
            ))
          )}
        </>
      )}
    </div>
  );
}