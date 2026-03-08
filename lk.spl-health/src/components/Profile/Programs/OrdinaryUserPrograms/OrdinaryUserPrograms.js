import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { SkeletonBrick } from "@consta/uikit/Skeleton";
import { ProgressStepBar } from '@consta/uikit/ProgressStepBar';
import { Text } from "@consta/uikit/Text";
import { Button } from "@consta/uikit/Button";
import { UserAPI } from "../../../../app/API/api";
import { ProgramCard } from "../../../Categories/ProgramCard/ProgramCard";
import { LessonStates, ProgramStates } from "../../../../app/constants";
import { Card } from "@consta/uikit/Card";
import { ProgramIndicators } from "./ProgramIndicators";
import cx from "classnames";

import styles from '../ProfilePrograms.module.css';

const isLessonCompleted = (lesson) => {
  const isCompleted = lesson.state === LessonStates.completed;

  return isCompleted;
}

export const OrdinaryUserPrograms = () => {

  const [programs, setPrograms] = useState([]);
  const [showIndicators, setShowIndicators] = useState(false);
  const [indicatorsProgram, setIndicatorsProgram] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const getPrograms = async () => {
    setIsLoading(true);

    try {
      const programs = await UserAPI.getUserPrograms();
      setPrograms(programs);
    } catch (apiError) {
      const { response } = apiError;
      const { data } = response;

      toast.error(`${data.code}: ${data.message}`);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    getPrograms();
  }, []);

  const handleContinueButtonCLick = (program) => {
    navigate(`/program/${program.id}/without`);
  }

  const handleContinueButtonCLickWithRepetitor = (program) => {
    navigate(`/program/${program.id}/with`);
  }

  const handleProgramIndicators = (program) => {
    setShowIndicators(true);
    setIndicatorsProgram(program);
  }

  const handleStatisticsBackClick = () => {
    setShowIndicators(false);
    setIndicatorsProgram(null);
  }

  return (
    <Card
      verticalSpace="2xl"
      horizontalSpace="2xl"
      className={styles.programs__list}
    >
      {showIndicators ? (
        <ProgramIndicators
          program={indicatorsProgram}
          handleStatisticsBackClick={handleStatisticsBackClick}
        />
      ) : (
        <>
          <div className={cx(styles.header, styles['only-title'])}>
            <Text
              size="l"
              weight="bold"
              className={styles.title}
            >
              Ваши курсы
            </Text>
          </div>
          {isLoading ? (
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
              {programs?.map((program) => (
                <ProgramCard
                  key={program.id}
                  program={program}
                  onCardClick={() => { }}
                >
                  <div className={styles['program-card__content']}>
                    <ProgramLessonsStepBar program={program} />
                    <div className={styles['program-card__footer']}>
                      {program.state === ProgramStates.started && (
                        <>
                          <Button
                            label="Продолжить"
                            size="s"
                            view="primary"
                            className={styles.button__continue}
                            onClick={() => handleContinueButtonCLick(program)}
                          />
                          <Button
                            label="Продолжить c репетитором"
                            size="s"
                            view="primary"
                            className={styles.button__continue}
                            onClick={() => handleContinueButtonCLickWithRepetitor(program)}
                          />
                          <Button
                            label="Статистика"
                            size="s"
                            view="secondary"
                            className={styles.button__continue}
                            onClick={() => handleProgramIndicators(program)}
                          />
                        </>
                      )}
                    </div>
                  </div>
                </ProgramCard>
              ))}
            </>
          )}
        </>
      )}
    </Card>
  );
}

const ProgramLessonsStepBar = React.memo(({ program }) => {
  return (
    <ProgressStepBar
      steps={program.lessons.map((lesson) => ({
        ...lesson,
        status: isLessonCompleted(lesson) ? 'success' : 'normal',
        lineStatus: isLessonCompleted(lesson) ? 'success' : 'normal',
        point: lesson.position_in_program
      }))}
      activeStepIndex={program.lessons.length - 1}
      getItemLabel={(lesson) => (
        <Text
          size="xs"
          view="linkMinor"
        >
          Занятие {lesson.point}
        </Text>
      )}
    />
  )
}, (oldProps, newProps) => oldProps.program.id === newProps.program.id)