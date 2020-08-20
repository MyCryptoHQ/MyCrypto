import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { ContentPanel } from '@components';
import { translateRaw } from '@translations';
import { ROUTE_PATHS } from '@config';

import { IStepperPath } from './types';

export interface StepperProps {
  steps: IStepperPath[];
  defaultBackPath?: string; // Path that component reverts to when user clicks "back" from first step in flow.
  defaultBackPathLabel?: string;
  completeBtnText?: string; // Text for btn to navigate out of flow in last step.
  wrapperClassName?: string;
  basic?: boolean;
  onRender?(goToNextStep: () => void): void;
}

export function GeneralStepper({
  steps,
  defaultBackPath,
  defaultBackPathLabel,
  completeBtnText,
  wrapperClassName = '',
  basic = false,
  onRender
}: StepperProps) {
  const history = useHistory();
  const [step, setStep] = useState(0);

  const goToPrevStep = () => {
    return setStep(Math.max(0, step - 1));
  };

  const goToFirstStep = () => {
    return setStep(0);
  };

  const goBack = () =>
    step === 0 ? history.push(defaultBackPath || ROUTE_PATHS.DASHBOARD.path) : goToPrevStep();

  const getStep = (stepIndex: number) => {
    const path = steps;
    const { label, component, actions, props } = steps[stepIndex]; // tslint:disable-line
    return { currentPath: path, label, Step: component, stepAction: actions, props };
  };

  const { currentPath, label, Step, stepAction } = getStep(step);

  // Creates the label for the btn that sends user to the previous step.
  // If there is no previous step, you'll be going to either the default location (dashboard), or a user-specified location.
  // If there is a previous step, you'll go to that step and it's title is used as the back btn label.
  const getBackBtnLabel = () =>
    Math.max(-1, step - 1) === -1
      ? defaultBackPathLabel || translateRaw('DASHBOARD')
      : getStep(Math.max(0, step - 1)).label;

  const goToNextStep = () => setStep(Math.min(step + 1, currentPath.length - 1));

  const stepObject = steps[step];
  const stepProps = stepObject.props;
  const stepActions = stepObject.actions;

  if (onRender) {
    onRender(goToNextStep);
  }

  return (
    <ContentPanel
      onBack={goBack}
      backBtnText={getBackBtnLabel()}
      heading={label}
      stepper={{ current: step + 1, total: currentPath.length }}
      className={wrapperClassName}
      basic={basic}
    >
      <Step
        onComplete={(payload: any) =>
          stepAction ? stepAction(payload, goToNextStep, goToPrevStep) : goToNextStep()
        }
        completeButtonText={completeBtnText || translateRaw('SEND_ASSETS_SEND_ANOTHER')}
        resetFlow={() => (stepAction ? stepAction(goToFirstStep) : goToFirstStep())}
        {...stepProps}
        {...stepActions}
      />
    </ContentPanel>
  );
}

export default GeneralStepper;
