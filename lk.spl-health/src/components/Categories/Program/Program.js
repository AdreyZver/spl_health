import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { IconArrowLeft } from "@consta/uikit/IconArrowLeft";
import { Text } from "@consta/uikit/Text";
import { Button } from "@consta/uikit/Button";
import { ProgramStates } from "../../../app/constants";
import { ProgramsAPI } from "../../../app/API/api";

import styles from './Program.module.css';

export const Program = ({
  program,
  onBackClick
}) => {

  const navigate = useNavigate();
  const [isPending, setIsPending] = useState(false);

  const hanldeButtonStartClick = async () => {
    if (program.state !== ProgramStates.not_started) {
      navigate(`/program/${program.id}`);
    } else {
      setIsPending(true);
      try {
        await ProgramsAPI.startProgram({ programId: program.id });
        navigate(`/program/${program.id}`);
      } catch (apiError) {
        const { response } = apiError;
        const { data } = response;

        toast.error(`${data.code}: ${data.message}`);
      }
      setIsPending(false);
    }
  }

  return (
    <div className={styles.program}>
      <Text
        view="link"
        size="s"
        onClick={onBackClick}
        className={styles.button_back}
      >
        <IconArrowLeft view="link" size="xs" />
        Назад
      </Text>
      <Text
        as="h2"
        size="4xl"
      >
        {program.name}
      </Text>
      <Text
        lineHeight="l"
      >
        <div dangerouslySetInnerHTML={{ __html: program.description }}></div>
      </Text>
      <Button
        label={program.state !== ProgramStates.not_started ? 'Продолжить' : 'Начать'}
        loading={isPending}
        onClick={hanldeButtonStartClick}
        className={styles.button_start}
      />
    </div>
  )
}