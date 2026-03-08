import React, { useState } from "react";
import { Card } from "@consta/uikit/Card";
import { Text } from "@consta/uikit/Text";
import { Button } from "@consta/uikit/Button";
import { Modal } from "@consta/uikit/Modal";

import styles from './ExerciseCard.module.css';

export const ExerciseCard = ({
  exercise
}) => {
  const [isVideoMadalOpen, setIsVideoModalOpen] = useState(false);

  const hanldeButtonVideoClick = () => {
    setIsVideoModalOpen(true);
  }

  const handleCloseVideoModal = () => {
    setIsVideoModalOpen(false);
  }

  return (
    <Card
      verticalSpace="m"
      horizontalSpace="m"
      className={styles.exercise__card}
    >
      <div className={styles.exercise__name}>
        <Text
          size="l"
          weight="bold"
        >
          {exercise.name}
        </Text>
      </div>
      <Text>
        <Text as="span" weight="bold">Исходное положение: </Text>
        {exercise.initial_position}
      </Text>
      <Text>
        <Text as="span" weight="bold">Описание упражнения: </Text>
        {exercise.exercise_description}
      </Text>
      <Text>
        <Text as="span" weight="bold">Количество повторов: </Text>
        {exercise.duration}
      </Text>
      <Text>
        <Text as="span" weight="bold">Темп: </Text>
        {exercise.tempo}
      </Text>
      {exercise.video_url && (
        <>
          <Button
            label="Просмотр видео"
            onClick={hanldeButtonVideoClick}
            className={styles.video_button}
          />
          <Modal
            isOpen={isVideoMadalOpen}
            onClickOutside={handleCloseVideoModal}
            onEsc={handleCloseVideoModal}
          >
            <iframe
              width="560"
              height="315"
              src={exercise.video_url}
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
            ></iframe>
          </Modal>
        </>
      )}
    </Card>
  );
}