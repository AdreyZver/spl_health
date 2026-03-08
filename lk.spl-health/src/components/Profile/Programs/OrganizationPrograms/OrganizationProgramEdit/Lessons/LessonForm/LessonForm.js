import { Collapse } from "@consta/uikit/Collapse";
import { TextField } from "@consta/uikit/TextField";
import { useState } from "react";
import { Text } from "@consta/uikit/Text";
import { IconDraggable } from "@consta/icons/IconDraggable";
import { IconTrash } from "@consta/icons/IconTrash";
import { Exercises } from "../Exercises/Exercises";
import CalendarWithNotes from "../../../../../../CalendarWithNotes/CalendarWithNotes";
import cx from "classnames";
import { openMeetingsAPI } from "../../../../../../../app/API/api";
import { Button } from "@consta/uikit/Button";

import styles from "./LessonForm.module.css";

export const LessonForm = ({
  lesson,
  handleUpdateLesson,
  handleRemoveLesson
}) => {
  const [isLessonOpen, setIsLessonOpen] = useState(false);
  const [isExercisesOpen, setIsExercisesOpen] = useState(false);
  const [isTimetableOpen, setIsTimetableOpen] = useState(false);

  const toggleLessonOpen = () => {
    setIsLessonOpen(!isLessonOpen);
  }

  const toggleExercisesOpen = () => {
    setIsExercisesOpen(!isExercisesOpen);
  }

  const toggleTimetableOpen = () => {
    setIsTimetableOpen(!isTimetableOpen);
  }

  const handleChangeLessonField = (field, value) => {
    handleUpdateLesson({
      ...lesson,
      [field]: value
    });
  }

  const onRemoveActionClick = () => {
    handleRemoveLesson(lesson);
  }

  const handleConferenceCreate = async () => {
    const roomData = {
      closed: false,
      externalId: 'program_id__' + `${lesson.programs_id}__` + 'lesson_id__' + `${lesson.id}`,
      isPublic: true,
      type: 'CONFERENCE',
      name: 'Публичная комната для занятия ' + `"${lesson.name}"`,
      capacity: '25',
    }

    const response = await openMeetingsAPI.createNewRoom(roomData);

    if (response.type == "SUCCESS") {alert('Комната успешно создана')}
    else {alert('Ошибка при создании комнаты: ' + response.message)}
  }

  return (
    <div className={styles.lesson}>
      <div className={styles.header}>
        <Text
          weight="bold"
          size="l"
          className={styles['lesson-title']}
        >
          {lesson.name ? lesson.name : '<Укажите название>'}
        </Text>
        <div className={styles.actions}>
          <IconTrash
            size="s"
            title="Удалить"
            onClick={onRemoveActionClick}
            className={styles['action-remove']}
          />
          <IconDraggable
            className={cx("draggable-lesson-icon", styles['draggable-lesson-icon'])}
            size="s"
            title="Переместить"
          />
        </div>
      </div>
      <Collapse
        label="Основная информация"
        isOpen={isLessonOpen}
        onClick={toggleLessonOpen}
      >
        <div className={styles['main-info']}>
          <TextField
            required
            label="Название занятия"
            value={lesson.name}
            onChange={({ value }) => handleChangeLessonField('name', value)}
            status={!lesson.name && 'alert'}
          />
          <TextField
            required
            label="Описание"
            value={lesson.description}
            onChange={({ value }) => handleChangeLessonField('description', value)}
            type="textarea"
            rows={5}
            status={!lesson.description && 'alert'}
          />
        </div>
      </Collapse>
      <Collapse
        label="Упражнения"
        isOpen={isExercisesOpen}
        onClick={toggleExercisesOpen}
      >
        <Exercises
          lesson={lesson}
          handleUpdateExercises={(exercises) => handleChangeLessonField('exercises', exercises)}
        />
      </Collapse>
      <Collapse
        label="Расписание"
        isOpen={isTimetableOpen}
        onClick={toggleTimetableOpen}
      >
        <CalendarWithNotes
          lesson={lesson}
          mode={'admin'}
        />
        <Button
          style={{margin: '8px'}}
          size="m"
          view="primary"
          label="Создать комнату"
          onClick={handleConferenceCreate}
        />
      </Collapse>
    </div>
  )
}