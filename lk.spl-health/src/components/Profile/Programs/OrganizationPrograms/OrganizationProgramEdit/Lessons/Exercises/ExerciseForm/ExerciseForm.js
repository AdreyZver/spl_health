import { Collapse } from "@consta/uikit/Collapse";
import { TextField } from "@consta/uikit/TextField";
import { useState } from "react";
import { Text } from "@consta/uikit/Text";
import { IconDraggable } from "@consta/icons/IconDraggable";
import cx from "classnames";
import { IconTrash } from "@consta/icons/IconTrash";

import styles from "./ExerciseForm.module.css";

export const ExerciseForm = ({
  exercise,
  handleUpdateExercise,
  handleRemoveExercise
}) => {
  const [isExerciseOpen, setIsExerciseOpen] = useState(false);

  const toggleExerciseOpen = () => {
    setIsExerciseOpen(!isExerciseOpen);
  }

  const handleChangeExerciseField = (field, value) => {
    handleUpdateExercise({
      ...exercise,
      [field]: value
    });
  }

  const onRemoveActionClick = () => {
    handleRemoveExercise(exercise);
  }

  return (
    <div className={styles.exercise}>
      <div className={styles.header}>
        <Text
          weight="bold"
          className={styles['exercise-title']}
        >
          {exercise.name ? exercise.name : '<Укажите название>'}
        </Text>
        <div className={styles.actions}>
          <IconTrash
            size="s"
            title="Удалить"
            onClick={onRemoveActionClick}
            className={styles['action-remove']}
          />
          <IconDraggable
            className={cx("draggable-exercise-icon", styles['draggable-exercise-icon'])}
            size="s"
            title="Переместить"
          />
        </div>
      </div>
      <Collapse
        label="Основная информация"
        isOpen={isExerciseOpen}
        onClick={toggleExerciseOpen}
        size="s"
      >
        <div className={styles['main-info']}>
          <TextField
            size="s"
            required
            label="Название упражнения"
            value={exercise.name}
            onChange={({ value }) => handleChangeExerciseField('name', value)}
            status={!exercise.name && 'alert'}
          />
          <TextField
            required
            label="Описание"
            value={exercise.exercise_description}
            onChange={({ value }) => handleChangeExerciseField('exercise_description', value)}
            type="textarea"
            rows={5}
            status={!exercise.exercise_description && 'alert'}
          />
          <TextField
            size="s"
            required
            label="Исходное положение"
            value={exercise.initial_position}
            onChange={({ value }) => handleChangeExerciseField('initial_position', value)}
            status={!exercise.initial_position && 'alert'}
          />
          <TextField
            size="s"
            required
            label="Темп"
            value={exercise.tempo}
            onChange={({ value }) => handleChangeExerciseField('tempo', value)}
            status={!exercise.tempo && 'alert'}
          />
          <TextField
            size="s"
            required
            label="Продолжительность"
            value={exercise.duration}
            onChange={({ value }) => handleChangeExerciseField('duration', value)}
            status={!exercise.duration && 'alert'}
          />
          <TextField
            size="s"
            label="Ссылка на видео"
            value={exercise.video_url}
            onChange={({ value }) => handleChangeExerciseField('video_url', value)}
          />
        </div>
      </Collapse>
    </div>
  )
}