import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { ContentPanel } from 'v2/components';
import { translateRaw } from 'v2/translations';
import { ROUTE_PATHS } from 'v2/config';

import {
  DeFiZapEducation,
  ZapSelection,
  ZapForm,
  ConfirmZapInteraction,
  ZapInteractionReceipt
} from './components';
import { IDeFiPath } from './types';
import { useStateReducer } from 'v2/utils';
import ZapInteractionFactory from './stateFactory';

const initialZapFlowState = {
  zapSelected: undefined,
  txConfig: undefined,
  txReceipt: undefined
};

const DeFiZapFlow = ({ history }: RouteComponentProps<{}>) => {
  const [step, setStep] = useState(0);
  const { zapFlowState, handleZapSelection } = useStateReducer(
    ZapInteractionFactory,
    initialZapFlowState
  );

  const goToPrevStep = () => setStep(Math.max(0, step - 1));
  const goToFirstStep = () => setStep(0);

  const goBack = () => (step === 0 ? history.push(ROUTE_PATHS.DASHBOARD.path) : goToPrevStep());

  const steps: IDeFiPath[] = [
    {
      label: 'DeFi Zap Education',
      component: DeFiZapEducation
    },
    {
      label: 'Zap Selection',
      component: ZapSelection,
      actions: { handleZapSelection }
    },
    {
      label: 'Zap Form',
      component: ZapForm
    },
    {
      label: 'Confirm Transaction',
      component: ConfirmZapInteraction,
      props: (({ txConfig }) => ({ txConfig }))(zapFlowState)
    },
    {
      label: 'Zap Receipt',
      component: ZapInteractionReceipt,
      props: (({ txConfig, txReceipt }) => ({ txConfig, txReceipt }))(zapFlowState),
      actions: { goToFirstStep }
    }
  ];

  const getStep = (stepIndex: number) => {
    const path = steps;
    const { label, component, actions, props } = steps[stepIndex]; // tslint:disable-line
    return { currentPath: path, label, Step: component, stepAction: actions, props };
  };

  const { currentPath, label, Step, stepAction } = getStep(step);

  const getBackBtnLabel = () =>
    Math.max(-1, step - 1) === -1
      ? translateRaw('DASHBOARD')
      : getStep(Math.max(0, step - 1)).label;

  const goToNextStep = () => setStep(Math.min(step + 1, currentPath.length - 1));

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
          stepAction ? stepAction(payload, goToNextStep) : goToNextStep()
        }
        completeButtonText={translateRaw('SEND_ASSETS_SEND_ANOTHER')}
        resetFlow={goToFirstStep}
        {...stepProps}
        {...stepActions}
      />
    </ContentPanel>
  );
};

export default DeFiZapFlow;
