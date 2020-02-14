import React, { useState, useContext } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';

import { translateRaw } from 'v2/translations';
import { ExtendedContentPanel, Tabs, WALLET_STEPS } from 'v2/components';
import { ROUTE_PATHS, DEFAULT_NETWORK } from 'v2/config';
import { useStateReducer } from 'v2/utils';
import { ITxReceipt, ISignedTx, Tab } from 'v2/types';
import { getNetworkById, NetworkContext } from 'v2/services/Store';
import { BREAK_POINTS } from 'v2/theme';

import { interactWithContractsInitialState, InteractWithContractsFactory } from './stateFactory';
import { Interact, InteractionReceipt } from './components';
import { ABIItem, InteractWithContractState } from './types';
import InteractionConfirm from './components/InteractionConfirm';

const { SCREEN_XS } = BREAK_POINTS;

interface ExtendedTab extends Tab {
  path: string;
}

interface TStep {
  title: string;
  component: any;
  props: any;
  actions: any;
}

const Heading = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  align-items: center;

  @media (max-width: ${SCREEN_XS}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const TabsWrapper = styled.div`
  margin-top: 8px;
  width: fit-content;
`;

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
  const { history, location } = props;

  const goToFirstStep = () => {
    setStep(0);
  };

  const goToNextStep = () => {
    setStep(step + 1);
  };

  const goToPreviousStep = () => {
    if (step === 0) {
      history.push(ROUTE_PATHS.DASHBOARD.path);
    } else {
      setStep(step - 1);
    }
  };

  const tabClickRedirect = (url: string): void => {
    history.push(url);
  };

  const tabs: ExtendedTab[] = [
    {
      title: translateRaw('CONTRACTS_INTERACT'),
      path: ROUTE_PATHS.INTERACT_WITH_CONTRACTS.path,
      onClick: () => tabClickRedirect(ROUTE_PATHS.INTERACT_WITH_CONTRACTS.path)
    },
    {
      title: translateRaw('CONTRACTS_DEPLOY'),
      path: ROUTE_PATHS.DEPLOY_CONTRACTS.path,
      onClick: () => tabClickRedirect(ROUTE_PATHS.DEPLOY_CONTRACTS.path)
    }
  ];

  const currentRoute = tabs.find(tab => tab.path === location.pathname);

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
      heading={
        <Heading>
          {stepObject.title}
          <TabsWrapper>
            <Tabs
              tabs={tabs}
              selectedIndex={tabs.findIndex(tab => tab.path === currentRoute!.path)}
            />
          </TabsWrapper>
        </Heading>
      }
    >
      <StepComponent {...stepProps} {...stepActions} />
    </ExtendedContentPanel>
  );
};

export default withRouter(InteractWithContractsFlow);
