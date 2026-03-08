import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { SkeletonBrick } from "@consta/uikit/Skeleton";
import { Text } from "@consta/uikit/Text";
import { OrganizationAPI } from "../../../../../app/API/api";
import { Card } from "@consta/uikit/Card";
import cx from "classnames";
import { OrganizationProgramCard } from "./OrganizationProgramCard";
import { CreateProgramButtonWithModal } from "../CreateProgramButtonWithModal/CreateProgramButtonWithModal";
import { Select } from "@consta/uikit/Select";

import styles from '../../ProfilePrograms.module.css';

const viewModeItems = [
  {
    id: 1,
    label: 'Все',
    view: 'all'
  },
  {
    id: 2,
    label: 'Опубликованные',
    view: 'visible'
  },
  {
    id: 3,
    label: 'Скрытые',
    view: 'hidden'
  },
  {
    id: 4,
    label: 'Удаленные',
    view: 'deleted'
  },
]

export const OrganizationProgramsList = () => {

  const [programs, setPrograms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState(viewModeItems[0].view);
  const [isNeedReload, setIsNeedReload] = useState(true);

  const getPrograms = async () => {
    setIsLoading(true);

    try {
      const programs = await OrganizationAPI.getPrograms({
        view: view !== 'all' ? view : undefined
      });
      setPrograms(programs);
    } catch (apiError) {
      const { response } = apiError;
      const { data } = response;

      toast.error(`${data.code}: ${data.message}`);
    }

    setIsLoading(false);
    setIsNeedReload(false);
  }

  useEffect(() => {
    if (isNeedReload) {
      getPrograms();
    }
  }, [isNeedReload]);

  const handleCreateProgram = () => {
    setIsNeedReload(true);
  }

  const handleChangeView = (viewModeItem) => {
    setView(viewModeItem.view);
    setIsNeedReload(true);
  }

  return (
    <Card
      verticalSpace="2xl"
      horizontalSpace="2xl"
      className={styles.programs__list}
    >
      <div className={cx(styles.header)}>
        <Text
          size="l"
          weight="bold"
          className={styles.title}
        >
          Ваши курсы
        </Text>
        <CreateProgramButtonWithModal onCreate={handleCreateProgram} />
      </div>
      <div className={styles.filters}>
        <Select
          label="Статус"
          items={viewModeItems}
          value={viewModeItems.find((vmItem) => vmItem.view === view)}
          getItemKey={(item) => item.id}
          getItemLabel={(item) => item.label}
          onChange={({ value }) => handleChangeView(value)}
        />
      </div>
      {isLoading ? (
        <>
          {Array.apply(null, { length: 4 }).map((value, index) => (
            <SkeletonBrick
              key={`sceleton_${index}`}
              width="100%"
              height="100px"
            />
          ))}
        </>
      ) : (
        <>
          {programs?.map((program) => (
            <OrganizationProgramCard
              key={program.id}
              program={program}
              onCardClick={() => { }}
            />
          ))}
        </>
      )}
    </Card>
  );
}