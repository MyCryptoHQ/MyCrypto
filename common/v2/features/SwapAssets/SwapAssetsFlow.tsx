import React, { useState, ReactType } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { ExtendedContentPanel } from 'v2/components';
import {
  SwapAssets,
  SelectAddress,
  ConfirmSwap,
  WaitingDeposit,
  SwapTransactionReceipt
} from './components';
import { ROUTE_PATHS } from 'v2/config';

interface TStep {
  title: string;
  description?: string;
  component: ReactType;
}

const BroadcastTransactionFlow = (props: RouteComponentProps<{}>) => {
  const [step, setStep] = useState(0);

  const steps: TStep[] = [
    {
      title: 'Swap Assets',
      description: 'How much do you want to send and receive?',
      component: SwapAssets
    },
    {
      title: 'Select Addresses',
      description: 'Where will you be sending ETH from? Where would you like to receive your ZRX?',
      component: SelectAddress
    },
    {
      title: 'Confirm Swap',
      component: ConfirmSwap
    },
    {
      title: 'Waiting on Deposit',
      component: WaitingDeposit
    },
    {
      title: 'Transaction Receipt',
      component: SwapTransactionReceipt
    }
  ];

  const goToNextStep = () => {
    setStep(step + 1);
  };

  const goToPreviousStep = () => {
    const { history } = props;
    if (step === 0) {
      history.push(ROUTE_PATHS.DASHBOARD.path);
    } else {
      setStep(step - 1);
    }
  };

  const stepObject = steps[step];
  const StepComponent = stepObject.component;

  return (
    <ExtendedContentPanel
      onBack={goToPreviousStep}
      stepper={{ current: step + 1, total: steps.length }}
      width="650px"
      heading={stepObject.title}
      description={stepObject.description}
    >
      <StepComponent goToNextStep={goToNextStep} setStep={setStep} />
    </ExtendedContentPanel>
  );
};

export default withRouter(BroadcastTransactionFlow);
