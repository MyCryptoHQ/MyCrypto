import React, { useContext, useState } from 'react';

import { RouteComponentProps, withRouter } from 'react-router-dom';
import styled from 'styled-components';

import { ExtendedContentPanel, Tabs, WALLET_STEPS } from '@components';
import { DEFAULT_NETWORK, ROUTE_PATHS } from '@config';
import { getNetworkById, StoreContext, useNetworks } from '@services/Store';
import { BREAK_POINTS } from '@theme';
import { translateRaw } from '@translations';
import { ISignedTx, ITxReceipt, Tab } from '@types';
import { useStateReducer } from '@utils';

import { Interact, InteractionReceipt } from './components';
import InteractionConfirm from './components/InteractionConfirm';
import { InteractWithContractsFactory, interactWithContractsInitialState } from './stateFactory';
import { ABIItem, InteractWithContractState } from './types';

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

const InteractWithContractsFlow = (props: RouteComponentProps) => {
  const [step, setStep] = useState(0);
  const { getDefaultAccount } = useContext(StoreContext);
  const { networks } = useNetworks();
  const defaultAccount = getDefaultAccount();
  const initialState = {
    ...interactWithContractsInitialState,
    account: defaultAccount,
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

  const currentRoute = tabs.find((tab) => tab.path === location.pathname);

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
              selectedIndex={tabs.findIndex((tab) => tab.path === currentRoute!.path)}
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
