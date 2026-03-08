import { Collapse } from "@consta/uikit/Collapse";
import { TextField } from "@consta/uikit/TextField";
import { useState } from "react";
import { Checkbox } from "@consta/uikit/Checkbox";
import { IconDraggable } from "@consta/icons/IconDraggable";
import { IconTrash } from "@consta/icons/IconTrash";
import cx from "classnames";
import { Select } from "@consta/uikit/Select";

import styles from "./IndicatorForm.module.css";
import { Text } from "@consta/uikit/Text";

const typeSelectItems = [
  {
    id: 1,
    label: 'Текстовое',
    type: 'text'
  },
  {
    id: 2,
    label: 'Числовое',
    type: 'number'
  }
]

export const IndicatorForm = ({
  indicator,
  handleUpdateIndicator,
  handleRemoveIndicator
}) => {
  const [isIndicatorOpen, setIsIndicatorOpen] = useState(false);

  const toggleIndicatorOpen = () => {
    setIsIndicatorOpen(!isIndicatorOpen);
  }

  const handleChangeIndicatorField = (field, value) => {
    handleUpdateIndicator({
      ...indicator,
      [field]: value
    });
  }

  const onRemoveActionClick = () => {
    handleRemoveIndicator(indicator);
  }

  const onTypeSelectChange = (typeItem) => {
    handleChangeIndicatorField('type', typeItem.type);
  }

  return (
    <div className={styles.indicator}>
      <div className={styles.header}>
        <Text
          weight="bold"
          size="l"
          className={styles['indicator-title']}
        >
          {indicator.label ? indicator.label : '<Укажите название>'}
        </Text>
        <div className={styles.actions}>
          <IconTrash
            size="s"
            title="Удалить"
            onClick={onRemoveActionClick}
            className={styles['action-remove']}
          />
          <IconDraggable
            className={cx("draggable-indicator-icon", styles['draggable-indicator-icon'])}
            size="s"
            title="Переместить"
          />
        </div>
      </div>
      <Collapse
        label="Свойства"
        isOpen={isIndicatorOpen}
        onClick={toggleIndicatorOpen}
      >
        <div className={styles['main-info']}>
          <TextField
            required
            label="Свойство name для индикатора"
            value={indicator.name}
            onChange={({ value }) => handleChangeIndicatorField('name', value)}
            status={!indicator.name && 'alert'}
            caption="Используется внутри системы (не отображается пользователю)"
          />
          <TextField
            required
            label="Лейбл показателя"
            value={indicator.label}
            onChange={({ value }) => handleChangeIndicatorField('label', value)}
            status={!indicator.label && 'alert'}
            caption="Название поля на форме заполнения (отображается пользователю)"
          />
          <Checkbox
            label="Обязательно для заполнения"
            checked={+indicator.is_required}
            onChange={({ checked }) => handleChangeIndicatorField('is_required', checked)}
            className={styles.checkbox}
          />
          <Select
            items={typeSelectItems}
            value={typeSelectItems.find((typeItem) => typeItem.type === indicator.type)}
            getItemKey={(item) => item.id}
            getItemLabel={(item) => item.label}
            onChange={({ value }) => onTypeSelectChange(value)}
          />
        </div>
      </Collapse>
    </div>
  );
}