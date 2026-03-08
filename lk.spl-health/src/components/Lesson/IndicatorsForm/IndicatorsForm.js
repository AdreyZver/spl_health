import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Text } from "@consta/uikit/Text";
import { TextField } from "@consta/uikit/TextField";
import { IconClose } from "@consta/uikit/IconClose";
import { Button } from "@consta/uikit/Button";
import { Modal } from "@consta/uikit/Modal";
import { LessonsAPI } from "../../../app/API/api";

import styles from './IndicatorsForm.module.css';

const isFormValidCheck = (indicators, formState) => {
  const requiredIndicators = indicators.filter((indicator) => +indicator.is_required);

  const isValid = requiredIndicators.every((indicator) => formState[indicator.name]);

  return isValid;
}

export const IndicatorsForm = ({
  indicators,
  isOpen,
  onModalClose,
  lessonId
}) => {

  const [formState, setFormState] = useState({});
  const [isSaveRequestPending, setIsSaveRequestPending] = useState(false);
  const [isIndicatorsSaved, setIsIndicatorsSaved] = useState(false);

  useEffect(() => {
    let newFormState = {};

    indicators.forEach((indicator) => {
      newFormState[indicator.name] = null;
    });

    setFormState(newFormState);
  }, [indicators]);

  const saveIndicators = async () => {
    setIsSaveRequestPending(true);

    try {
      const result = await LessonsAPI.saveLessonIndicators({
        lessonId, indicators: formState
      });
      setIsIndicatorsSaved(true);
      toast.success('Показтели сохранены', {
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
      });
    } catch (apiError) {
      const { response } = apiError;
      const { data } = response;

      toast.error(`${data.code}: ${data.message}`);
    }

    setIsSaveRequestPending(false);
  }

  const handleSubmit = () => {
    saveIndicators();
  }

  const hanldeClose = () => {
    setFormState({});
    onModalClose();
  }

  const handleFormChange = (field, value) => {
    const newFormState = {
      ...formState,
      [field]: value
    };

    setFormState(newFormState);
  }

  const isFormValid = isFormValidCheck(indicators, formState);

  return (
    <Modal
      isOpen={isOpen}
      onClickOutside={hanldeClose}
      onEsc={hanldeClose}
    >
      <div className={styles.modal}>
        <div className={styles.modal_header}>
          <Text
            weight="bold"
            size="l"
          >
            Показтели здоровья
          </Text>
          <IconClose
            className={styles.modal_header__close}
            onClick={hanldeClose}
          />
        </div>
        <div className={styles.modal_body}>
          <div className={styles.form}>
            <div className={styles.fields}>
              {indicators.map((indicator) => (
                <TextField
                  value={formState[indicator.name]}
                  type={indicator.type}
                  required={+indicator.is_required}
                  label={indicator.label}
                  className={styles.fields__item}
                  onChange={({ value }) => handleFormChange(indicator.name, value)}
                />
              ))}
            </div>
            <div className={styles.form__caption}>
              <Text size="s">
                <sup>*</sup> поля обязательные для заполнения
              </Text>
            </div>
          </div>
        </div>
        <div className={styles.modal_footer}>
          <div className={styles.modal_actions}>
            {!isIndicatorsSaved ? (
              <>
                <Button
                  view="primary"
                  label="Сохранить"
                  onClick={handleSubmit}
                  disabled={!isFormValid}
                  loading={isSaveRequestPending}
                />
                <Button
                  view="secondary"
                  label="Продолжить без сохранения"
                  onClick={hanldeClose}
                  disabled={isSaveRequestPending}
                />
              </>
            ) : (
              <Button
                view="primary"
                label="Продолжить"
                onClick={hanldeClose}
              />
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}