import React from "react";
import { cnTabsTab, Tabs } from '@consta/uikit/Tabs';
import { Badge } from '@consta/uikit/Badge';

const BADGE_STATES = {
  'COMPLETED': {
    status: 'success',
    label: 'Завершено'
  },
  'UNCOMPLETED': {
    status: 'system',
    label: 'Не пройдено'
  },
  'AVAILABLE': {
    status: 'normal',
    label: 'Доступно'
  },
  'UNAVAILABLE': {
    status: 'error',
    label: 'Недоступно'
  }
};

export const LessonsList = ({
  lessons,
  activeLesson,
  onLessonSelect
}) => {

  const getItemRightSide = (item) => {
    return (
      <Badge
        status={BADGE_STATES[item.state]?.status}
        label={BADGE_STATES[item.state]?.label}
        size="s"
        style={{ marginLeft: 'var(--space-s)' }}
      />
    );
  }

  return (
    <Tabs
      value={activeLesson}
      onChange={({ value }) => onLessonSelect(value)}
      items={lessons}
      linePosition="right"
      size="m"
      getItemLabel={(item) => item.name}
      getItemRightSide={getItemRightSide}
    />
  )
}