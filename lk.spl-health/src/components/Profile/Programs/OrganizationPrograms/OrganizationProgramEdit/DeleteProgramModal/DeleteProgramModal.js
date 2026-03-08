import { Modal } from "@consta/uikit/Modal";
import { Text } from "@consta/uikit/Text";
import { Button } from "@consta/uikit/Button";
import { IconClose } from "@consta/uikit/IconClose";

import styles from "./DeleteProgramModal.module.css";

export const DeleteProgramModal = ({
  isOpen,
  toggleModalOpen,
  handleSubmit,
  isSubmitLoading
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClickOutside={toggleModalOpen}
      onEsc={toggleModalOpen}
    >
      <div className={styles.modal}>
        <div className={styles.modal_header}>
          <Text
            weight="bold"
            size="l"
          >
            Удаление программы
          </Text>
          <IconClose
            className={styles.modal_header__close}
            onClick={toggleModalOpen}
          />
        </div>

        <Text
          as="p"
          className={styles.warning}
          view="alert"
        >
          Удаление программы приведет к скрытию её из общего списка доступных пользователям программ и закроет доступ для дальнейшего прохождения программы тем пользователям, которые уже начали ее проходить.
        </Text>
        <Text
          weight="bold"
          size="l"
        >
          Вы уверены, что хотите удалить программу?
        </Text>
        <div className={styles.modal_footer}>
          <Button
            disabled={isSubmitLoading}
            view="secondary"
            label="Отменить"
            onClick={toggleModalOpen}
          />
          <Button
            disabled={isSubmitLoading}
            loading={isSubmitLoading}
            view="primary"
            label="Удалить"
            onClick={handleSubmit}
          />
        </div>
      </div>
    </Modal>
  )
}