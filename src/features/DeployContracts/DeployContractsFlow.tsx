import React, { useState, useContext } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';

import { translateRaw } from '@translations';
import { ExtendedContentPanel, Tabs, WALLET_STEPS } from '@components';
import { ROUTE_PATHS } from '@config';
import { useStateReducer } from '@utils';
import { ISignedTx, IPendingTxReceipt, Tab } from '@types';
import { BREAK_POINTS } from '@theme';

import { deployContractsInitialState, DeployContractsFactory } from './stateFactory';
import { Deploy, DeployConfirm, DeployReceipt } from './components';
import { DeployContractsState } from './types';
import { StoreContext } from '@services';

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

const DeployContractsFlow = (props: RouteComponentProps<{}>) => {
  const [step, setStep] = useState(0);
  const { defaultAccount } = useContext(StoreContext);
  const {
    handleNetworkSelected,
    handleDeploySubmit,
    handleByteCodeChanged,
    handleAccountSelected,
    handleTxSigned,
    handleGasSelectorChange,
    deployContractsState
  } = useStateReducer(DeployContractsFactory, {
    ...deployContractsInitialState,
    account: defaultAccount
  });

  const { account }: DeployContractsState = deployContractsState;
  const { history, location } = props;

  const goToFirstStep = () => {
    setStep(0);
    handleNetworkSelected(undefined);
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
      title: translateRaw('DEPLOY_CONTRACTS'),
      component: Deploy,
      props: (({ networkId, byteCode, rawTransaction }) => ({
        account,
        networkId,
        byteCode,
        rawTransaction
      }))(deployContractsState),
      actions: {
        handleByteCodeChanged,
        handleNetworkSelected,
        handleDeploySubmit: () => handleDeploySubmit(goToNextStep),
        handleAccountSelected,
        handleGasSelectorChange
      }
    },
    {
      title: translateRaw('CONFIRM_TX_MODAL_TITLE'),
      component: DeployConfirm,
      props: (({ txConfig }) => ({ txConfig }))(deployContractsState),
      actions: { goToNextStep }
    },
    {
      title: translateRaw('DEPLOY_SIGN'),
      component: account && WALLET_STEPS[account.wallet],
      props: (({ rawTransaction }) => ({
        network: account && account.network,
        senderAccount: account,
        rawTransaction
      }))(deployContractsState),
      actions: {
        onSuccess: (payload: IPendingTxReceipt | ISignedTx) => handleTxSigned(payload, goToNextStep)
      }
    },
    {
      title: translateRaw('DEPLOY_RECEIPT'),
      component: DeployReceipt,
      props: (({ txConfig, txReceipt }) => ({ txConfig, txReceipt }))(deployContractsState),
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

export default withRouter(DeployContractsFlow);
