import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { ContentPanel } from 'v2/components';
import { translateRaw } from 'v2/translations';
import { ROUTE_PATHS } from 'v2/config';

import { IStepperPath } from './types';

export interface StepperProps {
  steps: IStepperPath[];
  defaultBackPath?: string; // Path that component reverts to when user clicks "back" from first step in flow.
  defaultBackPathLabel?: string;
  completeBtnText?: string; // Text for btn to navigate out of flow in last step.
}

export function GeneralStepper({
  steps,
  defaultBackPath,
  defaultBackPathLabel,
  completeBtnText
}: StepperProps) {
  const history = useHistory();
  const [step, setStep] = useState(0);
  console.debug('[GeneralStepper]: Refresh -> step: ', step);
  const goToPrevStep = () => setStep(Math.max(0, step - 1));
  const goToFirstStep = () => setStep(0);

  const goBack = () =>
    step === 0 ? history.push(defaultBackPath || ROUTE_PATHS.DASHBOARD.path) : goToPrevStep();

  const getStep = (stepIndex: number) => {
    const path = steps;
    const { label, component, actions, props } = steps[stepIndex]; // tslint:disable-line
    return { currentPath: path, label, Step: component, stepAction: actions, props };
  };

  const { currentPath, label, Step, stepAction } = getStep(step);

  const getBackBtnLabel = () =>
    Math.max(-1, step - 1) === -1
      ? defaultBackPathLabel || translateRaw('DASHBOARD')
      : getStep(Math.max(0, step - 1)).label;

  const goToNextStep = () => {
    console.debug('[GeneralStepper]: Trigger goToNextStep');
    return setStep(Math.min(step + 1, currentPath.length - 1));
  };

  const stepObject = steps[step];
  const stepProps = stepObject.props;
  const stepActions = stepObject.actions;

  return (
    <ContentPanel
      onBack={goBack}
      backBtnText={getBackBtnLabel()}
      heading={label}
      stepper={{ current: step + 1, total: currentPath.length }}
    >
      <Step
        onComplete={(payload: any) =>
          stepAction ? stepAction(payload, goToNextStep()) : goToNextStep()
        }
        completeButtonText={completeBtnText || translateRaw('SEND_ASSETS_SEND_ANOTHER')}
        resetFlow={goToFirstStep}
        {...stepProps}
        {...stepActions}
      />
    </ContentPanel>
  );
}

export default GeneralStepper;
