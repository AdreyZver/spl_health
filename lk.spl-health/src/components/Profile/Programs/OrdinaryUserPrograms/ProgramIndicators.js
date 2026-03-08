import { useEffect, useState } from "react";
import { ProgramsAPI, UserAPI } from "../../../../app/API/api";
import { toast } from "react-toastify";
import { Loader } from "@consta/uikit/Loader";
import { Text } from "@consta/uikit/Text";
import { Line } from '@consta/charts/Line';
import { Button } from "@consta/uikit/Button";
import { IconArrowLeft } from "@consta/icons/IconArrowLeft";

import styles from './ProgramIndicators.module.css';

const prepareChartData = (programIndicators, savedIndicators) => {
  const preparedIndicators = savedIndicators?.reduce((result, savedIndicator) => {

    const indicatorNamesToSelect = programIndicators.map((item) => ({
      name: item.name,
      label: item.label
    }));

    let indicatorsToPush = [];

    if (savedIndicator.indicators) {
      indicatorsToPush = indicatorNamesToSelect.map((programIndicator) => ({
        lessonName: savedIndicator.lesson_info.name,
        lessonPosition: savedIndicator.lesson_info.position_in_program,
        indicatorName: programIndicator.label,
        indicatorValue: savedIndicator.indicators[programIndicator.name]
      }));
    } else {
      indicatorsToPush = indicatorNamesToSelect.map((programIndicator) => ({
        lessonName: savedIndicator.lesson_info.name,
        lessonPosition: savedIndicator.lesson_info.position_in_program,
        indicatorName: programIndicator.label,
        indicatorValue: 0
      }));
    }

    result = [
      ...result,
      ...indicatorsToPush
    ];

    return result;
  }, []);

  return preparedIndicators;
}

export const ProgramIndicators = ({
  program,
  handleStatisticsBackClick
}) => {
  const [savedIndicators, setSavedIndicators] = useState();
  const [programIndicators, setProgramIndicators] = useState();
  const [isSavedIndicatorsLoading, setIsSavedIndicatorsLoading] = useState(false);
  const [isProgramIndicatorsLoading, setIsProgramIndicatorsLoading] = useState(false);

  const getUserProgramSavedIndicators = async (programId) => {
    setIsSavedIndicatorsLoading(true);

    try {
      const indicators = await UserAPI.getUserProgramIndicators({ programId });
      setSavedIndicators(indicators);
    } catch (apiError) {
      const { response } = apiError;
      const { data } = response;

      toast.error(`${data.code}: ${data.message}`);
    }

    setIsSavedIndicatorsLoading(false);
  }

  const getUserProgramIndicators = async (programId) => {
    setIsProgramIndicatorsLoading(true);

    try {
      const indicators = await ProgramsAPI.getProgramIndicators({ programId });
      setProgramIndicators(indicators.filter(indicator => indicator.type === "number"));
    } catch (apiError) {
      const { response } = apiError;
      const { data } = response;

      toast.error(`${data.code}: ${data.message}`);
    }

    setIsProgramIndicatorsLoading(false);
  }


  useEffect(() => {
    if (program?.id) {
      getUserProgramSavedIndicators(program.id);
      getUserProgramIndicators(program.id);
    }
  }, [program.id]);

  if (isSavedIndicatorsLoading || isProgramIndicatorsLoading) {
    return (
      <Loader />
    )
  }

  const indicatorsToChart = prepareChartData(programIndicators, savedIndicators);

  return (
    <div className={styles.indicators}>
      <Button
        label="Назад"
        view="clear"
        iconLeft={IconArrowLeft}
        size="s"
        className={styles['button-back']}
        onClick={handleStatisticsBackClick}
      />
      <Text
        size="2xl"
        weight="bold"
      >
        Статистика: {program.name}
      </Text>
      {indicatorsToChart && (
        <Line
          width={800}
          data={indicatorsToChart}
          xField="lessonName"
          yField="indicatorValue"
          seriesField="indicatorName"
        />
      )}
    </div>
  )
}