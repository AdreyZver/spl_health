import React from "react"
import { Card } from "@consta/uikit/Card"
import { Text } from "@consta/uikit/Text"
import { Badge } from "@consta/uikit/Badge"
import { ProgramStates } from "../../../app/constants"

import styles from './ProgramCard.module.css'

const BADGE_STATES = {
  [ProgramStates.completed]: {
    status: 'success',
    label: 'Завершено'
  },
  [ProgramStates.started]: {
    status: 'normal',
    label: 'В процессе'
  },
  [ProgramStates.hidden]: {
    status: 'system',
    label: 'Скрыта владельцем'
  },
  [ProgramStates.deleted]: {
    status: 'error',
    label: 'Удалена владельцем'
  },
}

export const ProgramCard = ({
  program,
  onCardClick,
  children
}) => {
  return (
    <Card
      verticalSpace="m"
      horizontalSpace="m"
      className={styles.program__card}
      onClick={() => onCardClick(program)}
    >
      <Text size="s">
        Программа тренировок
      </Text>
      <Text weight="bold">
        {program.name}
        {BADGE_STATES[program.state] && (
          <Badge
            status={BADGE_STATES[program.state].status}
            label={BADGE_STATES[program.state].label}
            size="s"
            style={{ marginLeft: 'var(--space-s)' }}
          />
        )}
      </Text>
      <Text size="s">
        Занятий: {program.lessons.length}
      </Text>
      {children}
    </Card>
  )
}