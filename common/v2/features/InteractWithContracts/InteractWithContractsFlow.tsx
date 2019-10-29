import React, { useState, ReactType } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { ExtendedContentPanel } from 'v2/components';
import { Interact, InteractionReceipt } from './components';
import { ROUTE_PATHS, DEFAULT_NETWORK } from 'v2/config';
import { translateRaw } from 'translations';

interface TStep {
  title: string;
  component: ReactType;
}

const InteractWithContractsFlow = (props: RouteComponentProps<{}>) => {
  const [step, setStep] = useState(0);
  const [network, setNetwork] = useState(DEFAULT_NETWORK);

  const steps: TStep[] = [
    { title: translateRaw('Interact with Contracts'), component: Interact },
    { title: translateRaw('Interaction Receipt'), component: InteractionReceipt }
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
    >
      <StepComponent
        goToNextStep={goToNextStep}
        setStep={setStep}
        network={network}
        setNetwork={setNetwork}
      />
    </ExtendedContentPanel>
  );
};

export default withRouter(InteractWithContractsFlow);
