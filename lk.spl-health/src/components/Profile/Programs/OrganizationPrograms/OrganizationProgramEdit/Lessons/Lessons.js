import { useEffect, useState } from "react"
import { ReactSortable } from "react-sortablejs";
import { Button } from "@consta/uikit/Button";
import { IconAdd } from "@consta/icons/IconAdd";
import { IconRevert } from "@consta/icons/IconRevert";
import { IconSave } from "@consta/icons/IconSave";
import isEqual from "lodash.isequal";
import { LessonForm } from "./LessonForm/LessonForm";
import { Text } from "@consta/uikit/Text";
import omit from "lodash.omit";
import { OrganizationAPI } from "../../../../../../app/API/api";
import { toast } from "react-toastify";

import styles from "./Lessons.module.css";

const getVisibleLessons = (lessons) => {
  return lessons.filter(lesson => !lesson.deleted);
}

export const OrganizationProgramEditLesson = ({
  program,
  onUpdate
}) => {

  const [lessons, setLessons] = useState([]);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const updateLessons = async () => {
    setIsSubmitLoading(true);

    try {
      await OrganizationAPI.updateProgramLessons({
        programId: program.id,
        lessons
      });

      toast.success('Занятия обновлены');
      onUpdate({ lessons });
    } catch (apiError) {
      const { response } = apiError;
      const { data } = response;

      toast.error(`${data.code}: ${data.message}`);
    }

    setIsSubmitLoading(false);
  }

  const handleUpdateLessonPositions = (lessons) => {
    let position = 1;
    const lessonsWithNewPositions = lessons.map((lesson, index) => !lesson.deleted ? ({
      ...lesson,
      position_in_program: position++
    }) : lesson);

    setLessons(lessonsWithNewPositions);
  }

  useEffect(() => {
    setLessons(program.lessons);
  }, [program]);

  const isLessonsEquals = () => {
    const stateLessons = lessons.map((lesson) => omit(lesson, [
      'selected',
      'chosen',
      'filtered'
    ]));
    const programLessons = program.lessons.map((lesson) => omit(lesson, [
      'selected',
      'chosen',
      'filtered'
    ]));

    return isEqual(stateLessons, programLessons);
  }

  const handleSubmit = () => {
    updateLessons();
  }

  const handleUpdateLesson = (lessonToUpdate) => {
    const newLessons = lessons.map((lesson) => lesson.id === lessonToUpdate.id ? lessonToUpdate : lesson);

    setLessons(newLessons);
  }

  const handleRemoveLesson = (lessonToRemove) => {
    let fileredLessons = [];

    if (lessonToRemove.id < 0) {
      fileredLessons = lessons.filter((lesson) => lesson.id !== lessonToRemove.id);
    } else {
      let position = 1;
      fileredLessons = lessons.map((lesson, index) => lesson.id === lessonToRemove.id ? ({
        ...lessonToRemove,
        deleted: true,
        position_in_program: null,
      }) : ({
        ...lesson,
        position_in_program: position++,
      }));
    }

    setLessons(fileredLessons);
  }

  const handleAddLesson = () => {
    const newLesson = {
      id: (lessons.length + 1) * -1,
      name: null,
      description: null,
      position_in_program: getVisibleLessons(lessons).length + 1,
      exercises: [],
    }

    setLessons([...lessons, newLesson]);
  }

  const handleReset = () => {
    setLessons(program.lessons);
  }

  const isLessonsInfoValid = () => {
    return lessons.every((lesson) => lesson.name && lesson.description);
  }

  const isExercisesInfoValid = () => {
    return lessons.every((lesson) => lesson.exercises ?
        lesson.exercises.every((exercise) => exercise.name &&
          exercise.exercise_description &&
          exercise.initial_position &&
          exercise.tempo &&
          exercise.duration
      ) : true
    );
  }

  const isLessonsEqualsFlag = isLessonsEquals();
  const isLessonsInfoValidFlag = isLessonsInfoValid();
  const isExercisesInfoValidFlag = isExercisesInfoValid();

  const isSubmitButtonDisabled = isLessonsEqualsFlag || !isLessonsInfoValidFlag || !isExercisesInfoValidFlag || isSubmitLoading;
  const isResetButtonDisabled = isLessonsEqualsFlag || isSubmitLoading;

  return (
    <div className={styles.list}>
      <ReactSortable
        list={lessons}
        setList={handleUpdateLessonPositions}
        animation={200}
        delayOnTouchStart={true}
        delay={2}
        className={styles['lessons-list']}
        handle=".draggable-lesson-icon"
      >
        {getVisibleLessons(lessons).map((lesson) => (
          <LessonForm
            key={lesson.id}
            lesson={lesson}
            handleUpdateLesson={handleUpdateLesson}
            handleRemoveLesson={handleRemoveLesson}
          />
        ))}
      </ReactSortable>
      <div
        className={styles['text-add']}
        onClick={handleAddLesson}
      >
        <IconAdd size="l"/>
        <Text
          size="xl"
          weight="bold"
        >
          Добавить занятие
        </Text>
      </div>
      <div className={styles.footer}>
        <Button
          label="Сбросить"
          onClick={handleReset}
          view="secondary"
          iconLeft={IconRevert}
          disabled={isResetButtonDisabled}
          className={styles['button-reset']}
        />
        <Button
          label="Обновить"
          iconLeft={IconSave}
          onClick={handleSubmit}
          disabled={isSubmitButtonDisabled}
          className={styles['button-submit']}
        />
      </div>
    </div>
  );
}