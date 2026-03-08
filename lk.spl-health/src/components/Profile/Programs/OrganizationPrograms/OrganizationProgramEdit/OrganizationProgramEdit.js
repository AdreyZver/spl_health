import { Card } from "@consta/uikit/Card";
import { OrganizationAPI } from "../../../../../app/API/api";
import { Text } from "@consta/uikit/Text";
import { Loader } from "@consta/uikit/Loader";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@consta/uikit/Button";
import { Collapse } from "@consta/uikit/Collapse";
import { IconArrowLeft } from "@consta/icons/IconArrowLeft";
import { OrganizationProgramEditMainInfo } from "./MainInfo/MainInfo";
import { OrganizationProgramEditLesson } from "./Lessons/Lessons";
import { OrganizationProgramEditIndicators } from "./Indicators/Indicators";
import { IconTrash } from "@consta/icons/IconTrash";
import { IconRevert } from "@consta/icons/IconRevert";
import { Badge } from '@consta/uikit/Badge';
import { DeleteProgramModal } from "./DeleteProgramModal/DeleteProgramModal";
import { Switch } from '@consta/uikit/Switch';

import styles from "./OrganizationProgramEdit.module.css";

export const OrganizationProgramEdit = ({
  programId
}) => {

  const [program, setProgram] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRestoreLoading, setIsRestoreLoading] = useState(false);
  const [isPublishingLoading, setIsPublishingLoading] = useState(false);
  const [isMainInfoOpen, setIsMainInfoOpen] = useState(true);
  const [isLessonsOpen, setIsLessonsOpen] = useState(false);
  const [isIndicatorsOpen, setIsIndicatorsOpen] = useState(false);
  const [isNeedReload, setIsNeedReload] = useState(true);

  const getProgram = async () => {
    setIsLoading(true);

    try {
      const program = await OrganizationAPI.getProgram({ programId });
      setProgram(program);
      setIsNeedReload(false);
    } catch (apiError) {
      const { response } = apiError;
      const { data } = response;

      toast.error(`${data.code}: ${data.message}`);
    }

    setIsLoading(false);
  }

  const deleteProgram = async () => {
    setIsDeleteLoading(true);

    try {
      await OrganizationAPI.deleteProgram({ programId });
      toast.success('Программа удалена');
      setIsDeleteModalOpen(false);
      setIsNeedReload(true);
    } catch (apiError) {
      const { response } = apiError;
      const { data } = response;

      toast.error(`${data.code}: ${data.message}`);
    }

    setIsDeleteLoading(false);
  }

  const restoreProgram = async () => {
    setIsRestoreLoading(true);

    try {
      await OrganizationAPI.restoreProgram({ programId });
      toast.success('Программа восстановлена');
      setIsNeedReload(true);
    } catch (apiError) {
      const { response } = apiError;
      const { data } = response;

      toast.error(`${data.code}: ${data.message}`);
    }

    setIsRestoreLoading(false);
  }

  const updateProgramIsPublished = async (isPublished) => {
    setIsPublishingLoading(true);

    try {
      await OrganizationAPI.udpateProgramIsPublished({
        programId,
        isPublished: +isPublished
      });
      toast.success(`Программа ${isPublished ? 'опубликована' : 'снята с публикации'}`);
      setProgram({
        ...program,
        is_published: +isPublished
      })
    } catch (apiError) {
      const { response } = apiError;
      const { data } = response;

      toast.error(`${data.code}: ${data.message}`);
    }

    setIsPublishingLoading(false);
  }

  useEffect(() => {
    if (isNeedReload) {
      getProgram();
    }
  }, [programId, isNeedReload]);

  const toggleMainInfoOpen = () => {
    setIsMainInfoOpen(!isMainInfoOpen);
  }

  const toggleLessonsOpen = () => {
    setIsLessonsOpen(!isLessonsOpen);
  }

  const toggleIndicatorsOpen = () => {
    setIsIndicatorsOpen(!isIndicatorsOpen);
  }

  const handleUpdateProgram = ({
    name,
    description,
    category_id
  }) => {
    setProgram({
      ...program,
      name,
      description,
      category_id
    });
  }

  const toggleDeleteModalOpen = () => {
    setIsDeleteModalOpen(!isDeleteModalOpen);
  }

  const handleProgramDeleteButtonClick = () => {
    toggleDeleteModalOpen();
  }

  const handleSubmitDelete = () => {
    deleteProgram();
  }

  const handleRestoreProgram = () => {
    restoreProgram();
  }

  const handleUpdateProgramIndicators = ({ indicators }) => {
    setProgram({
      ...program,
      indicators
    });
  }

  const handleUpdateIsProgramPublished = (isPublished) => {
    updateProgramIsPublished(isPublished);
  }

  const handleUpdateProgramLessons = (lessons) => {
    setIsNeedReload(true);
  }

  return (
    <Card
      verticalSpace="2xl"
      horizontalSpace="2xl"
      className={styles.wrapper}
    >
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {!program ? (
            <>
              <Text
                view="alert"
                size="2xl"
              >
                Программа не найдена
              </Text>
            </>
          ) : (
            <>
              <div className={styles.header}>
                <Button
                  label="Назад"
                  view="clear"
                  iconLeft={IconArrowLeft}
                  size="s"
                  as="a"
                  className={styles['button-back']}
                  href="/profile/programs"
                />
                <div className={styles.actions}>
                  {!program.deleted_at ? (
                    <>
                      <Switch
                        label="Опубликована"
                        checked={program.is_published}
                        disabled={isPublishingLoading}
                        onChange={({ checked }) => handleUpdateIsProgramPublished(checked)}
                      />
                      <Button
                        label="Удалить"
                        iconLeft={IconTrash}
                        view="ghost"
                        onClick={handleProgramDeleteButtonClick}
                        loading={isDeleteLoading}
                        disabled={isDeleteLoading || isPublishingLoading}
                      />
                      <DeleteProgramModal
                        isOpen={isDeleteModalOpen}
                        toggleModalOpen={toggleDeleteModalOpen}
                        handleSubmit={handleSubmitDelete}
                        isSubmitLoading={isDeleteLoading}
                      />
                    </>
                  ) : (
                    <Button
                      label="Восстановить"
                      iconLeft={IconRevert}
                      loading={isRestoreLoading}
                      view="primary"
                      onClick={handleRestoreProgram}
                    />
                  )}
                </div>
              </div>
              <Text
                as="h2"
                className={styles.title}
                weight="bold"
                size="2xl"
                align="center"
              >
                {program.name}
                {program.deleted_at ? (
                  <Badge
                    label="Удалена"
                    status="error"
                  />
                ) : (
                  <>
                    {program.is_published ? (
                      <Badge
                        label="Опубликована"
                        status="success"
                      />
                    ) : (
                      <Badge
                        label="Скрыта"
                        status="system"
                      />
                    )}
                  </>
                )}
              </Text>
              <Collapse
                label="Основная информация"
                isOpen={isMainInfoOpen}
                onClick={toggleMainInfoOpen}
                size="l"
                hoverEffect
                divider
              >
                <OrganizationProgramEditMainInfo
                  program={program}
                  onUpdate={handleUpdateProgram}
                />
              </Collapse>
              <Collapse
                label={
                  <text
                    className={styles.collapse_label}
                  >
                    Показатели
                    {program.deleted_at && (
                      <Badge
                        label="Недоступно"
                        size="s"
                        status="error"
                      />
                    )}
                  </text>
                }
                isOpen={isIndicatorsOpen}
                onClick={!program.deleted_at ? toggleIndicatorsOpen : () => {}}
                size="l"
                hoverEffect
                divider
              >
                <OrganizationProgramEditIndicators
                  program={program}
                  onUpdate={handleUpdateProgramIndicators}
                />
              </Collapse>
              <Collapse
                label={
                  <text
                    className={styles.collapse_label}
                  >
                    Занятия
                    {program.deleted_at && (
                      <Badge
                        label="Недоступно"
                        size="s"
                        status="error"
                      />
                    )}
                  </text>
                }
                isOpen={isLessonsOpen}
                onClick={!program.deleted_at ? toggleLessonsOpen : () => {}}
                size="l"
                hoverEffect
                divider
              >
                <OrganizationProgramEditLesson
                  program={program}
                  onUpdate={handleUpdateProgramLessons}
                />
              </Collapse>
            </>
          )}
        </>
      )}
    </Card>
  )
}