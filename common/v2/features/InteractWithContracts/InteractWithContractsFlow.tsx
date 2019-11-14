import React, { useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { translateRaw } from 'translations';

import { ExtendedContentPanel } from 'v2/components';
import { ROUTE_PATHS } from 'v2/config';
import { useStateReducer } from 'v2/utils/useStateReducer';

import { interactWithContractsInitialState, InteractWithContractsFactory } from './stateFactory';
import { Interact, InteractionReceipt } from './components';
import { ABIItem, InteractWithContractState } from './types';
import { ITxReceipt, ISignedTx } from 'v2/types';
import { WALLET_STEPS } from './helpers';

interface TStep {
  title: string;
  component: any;
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
    updateNetworkContractOptions,
    setGeneratedFormVisible,
    handleInteractionFormSubmit,
    handleInteractionFormWriteSubmit,
    handleAccountSelected,
    handleTxSigned
  } = useStateReducer(InteractWithContractsFactory, interactWithContractsInitialState);
  const { account }: InteractWithContractState = interactWithContractsState;

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
      props: (({ networkId, contractAddress, contract, abi, contracts, showGeneratedForm }) => ({
        networkId,
        contractAddress,
        contract,
        abi,
        contracts,
        showGeneratedForm,
        account
      }))(interactWithContractsState),
      actions: {
        handleNetworkSelected,
        handleContractSelected,
        handleContractAddressChanged,
        handleAbiChanged,
        updateNetworkContractOptions,
        setGeneratedFormVisible,
        handleInteractionFormSubmit,
        handleInteractionFormWriteSubmit: (payload: ABIItem) =>
          handleInteractionFormWriteSubmit(payload, goToNextStep),
        handleAccountSelected
      }
    },
    {
      title: 'Sign write transaction',
      component: account && WALLET_STEPS[account.wallet],
      props: (({ rawTransaction }) => ({
        network: account && account.network,
        senderAccount: account,
        rawTransaction
      }))(interactWithContractsState),
      actions: {
        onSuccess: (payload: ITxReceipt | ISignedTx) => handleTxSigned(payload, goToNextStep)
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
