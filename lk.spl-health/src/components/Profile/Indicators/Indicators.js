import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { SkeletonBrick } from "@consta/uikit/Skeleton";
import { ProgressStepBar } from '@consta/uikit/ProgressStepBar';
import { Text } from "@consta/uikit/Text";
import { Button } from "@consta/uikit/Button";
import { UserAPI } from "../../../app/API/api";
import { ProgramCard } from "../../Categories/ProgramCard/ProgramCard";
import { LessonStates, ProgramStates } from "../../../app/constants";
import { Card } from "@consta/uikit/Card";

import styles from './Indicators.module.css';

export const Indicators = () => {

  return (
    <Card
      verticalSpace="2xl"
      horizontalSpace="2xl"
      className={styles.indicators__card}
    >
      Показатели здоровья
    </Card>
  );
}