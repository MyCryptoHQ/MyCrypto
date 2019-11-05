import React, { useState, ReactType } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { ExtendedContentPanel } from 'v2/components';
import { Interact, InteractionReceipt } from './components';
import { ROUTE_PATHS } from 'v2/config';
import { translateRaw } from 'translations';

import { interactWithContractsInitialState, InteractWithContractsFactory } from './stateFactory';
import { useStateReducer } from 'v2/utils/useStateReducer';

interface TStep {
  title: string;
  component: ReactType;
  props: any;
  actions: any;
}

const InteractWithContractsFlow = (props: RouteComponentProps<{}>) => {
  const [step, setStep] = useState(0);
  const {
    interactWithContractsState,
    handleNetworkSelected,
    handleContractSelected,
    handleContractAddressChanged,
    handleAbiChanged,
    updateNetworkContractOptions
  } = useStateReducer(InteractWithContractsFactory, interactWithContractsInitialState);

  const goToFirstStep = () => {
    setStep(0);
  };

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

  const steps: TStep[] = [
    {
      title: translateRaw('Interact with Contracts'),
      component: Interact,
      props: (({ networkId, contractAddress, contract, abi, contracts }) => ({
        networkId,
        contractAddress,
        contract,
        abi,
        contracts
      }))(interactWithContractsState),
      actions: {
        handleNetworkSelected,
        handleContractSelected,
        handleContractAddressChanged,
        handleAbiChanged,
        updateNetworkContractOptions
      }
    },
    {
      title: translateRaw('Interaction Receipt'),
      component: InteractionReceipt,
      props: {},
      actions: { goToFirstStep }
    }
  ];

  const stepObject = steps[step];
  const StepComponent = stepObject.component;
  const stepProps = stepObject.props;
  const stepActions = stepObject.actions;

  return (
    <ExtendedContentPanel
      onBack={goToPreviousStep}
      stepper={{ current: step + 1, total: steps.length }}
      width="750px"
      heading={stepObject.title}
    >
      <StepComponent goToNextStep={goToNextStep} {...stepProps} {...stepActions} />
    </ExtendedContentPanel>
  );
};

export default withRouter(InteractWithContractsFlow);
