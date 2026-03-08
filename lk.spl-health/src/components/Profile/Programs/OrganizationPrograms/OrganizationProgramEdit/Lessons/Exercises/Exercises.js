import { ReactSortable } from "react-sortablejs";
import { ExerciseForm } from "./ExerciseForm/ExerciseForm";
import { Text } from "@consta/uikit/Text";
import { IconAdd } from "@consta/icons/IconAdd";

import styles from "./Exercises.module.css";

const getVisibleExercises = (exercises) => {
  return exercises.filter(exercise => !exercise.deleted);
}

export const Exercises = ({
  lesson,
  handleUpdateExercises
}) => {
  const handleUpdateExercisePositions = (exercises) => {
    let position = 1;
    const exercisesWithNewPositions = exercises.map((exercise, index) => !exercise.deleted ? ({
      ...exercise,
      position_in_lesson: position++
    }) : exercise);

    handleUpdateExercises(exercisesWithNewPositions);
  }

  const handleUpdateExercise = (exerciseToUpdate) => {
    const exercisesToUpdate = lesson.exercises?.map((exercise) => exercise.id === exerciseToUpdate.id ? exerciseToUpdate : exercise);

    handleUpdateExercises(exercisesToUpdate);
  }

  const handleRemoveExercise = (exerciseToRemove) => {
    let fileredExercises = [];

    if (exerciseToRemove.id < 0) {
      fileredExercises = lesson.exercises?.filter((exercise) => exercise.id !== exerciseToRemove.id);
    } else {
      let position = 1;
      fileredExercises = lesson.exercises.map((exercise) => exercise.id === exerciseToRemove.id ? ({
        ...exerciseToRemove,
        deleted: true,
        position_in_lesson: null,
      }) : ({
        ...exercise,
        position_in_lesson: position++,
      }));
    }

    handleUpdateExercises(fileredExercises);
  }

  const handleAddExercise = () => {
    const newExercise = {
      id: (lesson.exercises.length + 1) * -1,
      name: null,
      exercise_description: null,
      initial_position: null,
      tempo: null,
      duration: null,
      position_in_lesson: getVisibleExercises(lesson.exercises).length + 1,
      video_url: '',
    }

    handleUpdateExercises([...lesson.exercises, newExercise]);
  }

  const visibleExcersises = getVisibleExercises(lesson.exercises);

  return (
    <div className={styles.list}>
      <ReactSortable
        list={lesson.exercises ? lesson.exercises : []}
        setList={handleUpdateExercisePositions}
        animation={200}
        delayOnTouchStart
        delay={2}
        className={styles['exercises-list']}
        handle=".draggable-exercise-icon"
      >
        {visibleExcersises.map((exercise) => (
          <ExerciseForm
            key={exercise.id}
            exercise={exercise}
            handleUpdateExercise={handleUpdateExercise}
            handleRemoveExercise={handleRemoveExercise}
          />
        ))}
      </ReactSortable>
      <div
        className={styles['text-add']}
        onClick={handleAddExercise}
      >
        <IconAdd size="s"/>
        <Text weight="bold">
          Добавить упражнение
        </Text>
      </div>
    </div>
  )
}