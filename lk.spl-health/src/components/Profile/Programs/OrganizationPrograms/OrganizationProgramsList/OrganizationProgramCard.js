import React, { useRef } from "react"
import { Card } from "@consta/uikit/Card"
import { Text } from "@consta/uikit/Text"
import { useState } from "react";
import { ContextMenu } from '@consta/uikit/ContextMenu';
import { Button } from '@consta/uikit/Button';
import { Badge } from '@consta/uikit/Badge';
import { IconKebab } from "@consta/icons/IconKebab"
import { useNavigate } from "react-router-dom";

import styles from './OrganizationProgramCard.module.css';

const getNameBadgeInfo = (program) => {
  if (program.deleted_at) {
    return {
      label: 'Удалена',
      status: 'error'
    }
  }

  if (program.is_published) {
    return {
      label: 'Опубликована',
      status: 'success'
    }
  }

  return {
    label: 'Скрыта',
    status: 'system'
  }
}

export const OrganizationProgramCard = ({
  program,
  onCardClick,
}) => {

  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const contextMenuButtonRef = useRef(null);
  const navigate = useNavigate();

  const handleToggleContextMenuClick = (isOpen) => {
    setIsContextMenuOpen(isOpen);
  }

  const contextMenuItems = [
    {
      label: 'Редактировать',
      href: `/profile/programs/edit/${program.id}`,
    },
  ];

  const handleContextMenuItemClick = ({ item }) => {
    navigate(item.href);
  }

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
      <Text
        weight="bold"
        className={styles.program__name}
      >
        {program.name}
        <Badge {...getNameBadgeInfo(program)}/>
      </Text>
      <Text size="s">
        Занятий: {program.lessons.length}
      </Text>
      <Button
        ref={contextMenuButtonRef}
        onlyIcon
        iconLeft={IconKebab}
        onClick={() => handleToggleContextMenuClick(!isContextMenuOpen)}
        size="s"
        view="ghost"
        className={styles['program__context-button']}
      />
      <ContextMenu
        isOpen={isContextMenuOpen}
        items={contextMenuItems}
        anchorRef={contextMenuButtonRef}
        direction="downStartRight"
        onClickOutside={() => handleToggleContextMenuClick(false)}
        size="s"
        onItemClick={handleContextMenuItemClick}
      />
    </Card>
  )
}