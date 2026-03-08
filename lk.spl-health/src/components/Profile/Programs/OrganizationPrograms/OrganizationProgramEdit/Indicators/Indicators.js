import { useEffect, useState } from "react";
import { OrganizationAPI } from "../../../../../../app/API/api";
import { toast } from "react-toastify";
import { Button } from "@consta/uikit/Button";
import omit from "lodash.omit";
import isEqual from "lodash.isequal";
import { ReactSortable } from "react-sortablejs";
import { IconAdd } from "@consta/icons/IconAdd";
import { Text } from "@consta/uikit/Text";
import { IconRevert } from "@consta/icons/IconRevert";
import { IconSave } from "@consta/icons/IconSave";
import { IndicatorForm } from "./IndicatorForm/IndicatorForm";

import styles from "./Indicators.module.css";

const propsToOmit = [
  'selected',
  'chosen',
  'filtered',
  'key'
];

const prepareIndicatorsFormat = (indicators = []) => {
  return indicators.map((indicator, index) => ({
    ...indicator,
    is_required: +indicator.is_required,
    key: index + 1
  }));
}

export const OrganizationProgramEditIndicators = ({
  program,
  onUpdate
}) => {

  const [indicators, setIndicators] = useState([]);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  useEffect(() => {
    setIndicators(prepareIndicatorsFormat(program.indicators));
  }, [program]);

  const updateIndicators = async () => {
    setIsSubmitLoading(true);

    try {
      const indicatorsToSave = prepareIndicatorsFormat(indicators).map(indicator => omit(indicator, propsToOmit));

      await OrganizationAPI.updateProgramIndicators({
        programId: program.id,
        indicators: indicatorsToSave
      });

      toast.success('Показатели обновлены');
      onUpdate({ indicators: indicatorsToSave });
    } catch (apiError) {
      const { response } = apiError;
      const { data } = response;

      toast.error(`${data.code}: ${data.message}`);
    }

    setIsSubmitLoading(false);
  }

  const handleUpdateIndicators = (indicators) => {
    setIndicators(indicators);
  }

  const handleUpdateIndicatorItem = (indicatorToUpdate) => {
    const newIndicators = indicators.map((indicator) => indicator.key === indicatorToUpdate.key ? indicatorToUpdate : indicator);

    setIndicators(newIndicators);
  }

  const handleRemoveIndicator = (indicatorToRemove) => {
    let fileredIndicators = indicators.filter((indicator) => indicator.key !== indicatorToRemove.key);

    setIndicators(fileredIndicators);
  }

  const handleAddIndicator = () => {
    const newIndicator = {
      key: indicators.length + 1,
      name: null,
      label: null,
      is_required: 0,
      type: 'text',
    }

    setIndicators([...indicators, newIndicator]);
  }

  const handleSubmit = () => {
    updateIndicators();
  }

  const handleReset = () => {
    setIndicators(program.indicators);
  }

  const isIndicatorsEquals = () => {
    const stateIndicators = prepareIndicatorsFormat(indicators).map((indicator) => omit(indicator, propsToOmit));
    const programIndicators = prepareIndicatorsFormat(program.indicators).map((indicator) => omit(indicator, propsToOmit));

    return isEqual(stateIndicators, programIndicators);
  }

  const isIndicatorsInfoValid = () => {
    return indicators.every((indicator) => indicator.name && indicator.label);
  }

  const isIndicatorsEqualsFlag = isIndicatorsEquals();
  const isIndicatorsInfoValidFlag = isIndicatorsInfoValid();


  const isSubmitButtonDisabled = isIndicatorsEqualsFlag || !isIndicatorsInfoValidFlag || isSubmitLoading;
  const isResetButtonDisabled = isIndicatorsEqualsFlag || isSubmitLoading;

  return (
    <div className={styles.list}>
      <ReactSortable
        list={indicators}
        setList={handleUpdateIndicators}
        animation={200}
        delayOnTouchStart
        delay={2}
        className={styles['indicators-list']}
        handle=".draggable-indicator-icon"
      >
        {indicators.map((indicator) => (
          <IndicatorForm
            key={indicator.key}
            indicator={indicator}
            handleUpdateIndicator={handleUpdateIndicatorItem}
            handleRemoveIndicator={handleRemoveIndicator}
          />
        ))}
      </ReactSortable>
      <div
        className={styles['text-add']}
        onClick={handleAddIndicator}
      >
        <IconAdd size="l"/>
        <Text
          size="xl"
          weight="bold"
        >
          Добавить показатель
        </Text>
      </div>
      <div className={styles.footer}>
        <Button
          label="Сбросить"
          onClick={handleReset}
          view="secondary"
          iconLeft={IconRevert}
          disabled={isResetButtonDisabled}
          className={styles['button-reset']}
        />
        <Button
          label="Обновить"
          iconLeft={IconSave}
          onClick={handleSubmit}
          disabled={isSubmitButtonDisabled}
          className={styles['button-submit']}
        />
      </div>
    </div>
  );
}