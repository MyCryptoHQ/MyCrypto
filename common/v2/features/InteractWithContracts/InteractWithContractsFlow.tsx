import React, { useState, useContext } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { translateRaw } from 'v2/translations';
import { ExtendedContentPanel } from 'v2/components';
import { ROUTE_PATHS, DEFAULT_NETWORK } from 'v2/config';
import { useStateReducer } from 'v2/utils';
import { ITxReceipt, ISignedTx } from 'v2/types';
import { getNetworkById, NetworkContext } from 'v2/services/Store';

import { interactWithContractsInitialState, InteractWithContractsFactory } from './stateFactory';
import { Interact, InteractionReceipt } from './components';
import { ABIItem, InteractWithContractState } from './types';
import { WALLET_STEPS } from './helpers';
import InteractionConfirm from './components/InteractionConfirm';

interface TStep {
  title: string;
  component: any;
  props: any;
  actions: any;
}

const InteractWithContractsFlow = (props: RouteComponentProps<{}>) => {
  const [step, setStep] = useState(0);

  const { networks } = useContext(NetworkContext);
  const initialState = {
    ...interactWithContractsInitialState,
    network: getNetworkById(DEFAULT_NETWORK, networks)
  };
  const {
    interactWithContractsState,
    handleNetworkSelected,
    handleContractSelected,
    handleContractAddressChanged,
    handleAddressOrDomainChanged,
    handleAbiChanged,
    handleCustomContractNameChanged,
    updateNetworkContractOptions,
    displayGeneratedForm,
    handleInteractionFormSubmit,
    handleInteractionFormWriteSubmit,
    handleAccountSelected,
    handleTxSigned,
    handleSaveContractSubmit,
    handleGasSelectorChange,
    handleDeleteContract
  } = useStateReducer(InteractWithContractsFactory, initialState);

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
      title: translateRaw('NEW_HEADER_TEXT_14'),
      component: Interact,
      props: (({
        network,
        contractAddress,
        contract,
        abi,
        contracts,
        showGeneratedForm,
        customContractName,
        rawTransaction,
        addressOrDomainInput,
        resolvingDomain
      }) => ({
        network,
        contractAddress,
        contract,
        abi,
        contracts,
        showGeneratedForm,
        account,
        customContractName,
        rawTransaction,
        addressOrDomainInput,
        resolvingDomain
      }))(interactWithContractsState),
      actions: {
        handleNetworkSelected,
        handleContractSelected,
        handleContractAddressChanged,
        handleAddressOrDomainChanged,
        handleAbiChanged,
        handleCustomContractNameChanged,
        updateNetworkContractOptions,
        displayGeneratedForm,
        handleInteractionFormSubmit,
        handleSaveContractSubmit,
        handleInteractionFormWriteSubmit: (payload: ABIItem) =>
          handleInteractionFormWriteSubmit(payload, goToNextStep),
        handleAccountSelected,
        handleGasSelectorChange,
        handleDeleteContract
      }
    },
    {
      title: translateRaw('CONFIRM_TX_MODAL_TITLE'),
      component: InteractionConfirm,
      props: (({ txConfig }) => ({ txConfig }))(interactWithContractsState),
      actions: { goToNextStep }
    },
    {
      title: translateRaw('INTERACT_SIGN_WRITE'),
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
      title: translateRaw('INTERACT_RECEIPT'),
      component: InteractionReceipt,
      props: (({ txConfig, txReceipt }) => ({ txConfig, txReceipt }))(interactWithContractsState),
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
      <StepComponent {...stepProps} {...stepActions} />
    </ExtendedContentPanel>
  );
};

export default withRouter(InteractWithContractsFlow);
