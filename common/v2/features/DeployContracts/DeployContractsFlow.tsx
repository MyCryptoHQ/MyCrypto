import React, { useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { translateRaw } from 'v2/translations';
import { ExtendedContentPanel } from 'v2/components';
import { ROUTE_PATHS } from 'v2/config';
import { useStateReducer } from 'v2/utils';
import { ITxReceipt, ISignedTx } from 'v2/types';

import { deployContractsInitialState, DeployContractsFactory } from './stateFactory';
import { Deploy, DeployConfirm, DeployReceipt } from './components';
import { DeployContractsState } from './types';
import { WALLET_STEPS } from './helpers';

interface TStep {
  title: string;
  component: any;
  props: any;
  actions: any;
}

const DeployContractsFlow = (props: RouteComponentProps<{}>) => {
  const [step, setStep] = useState(0);
  const {
    handleNetworkSelected,
    handleDeploySubmit,
    handleByteCodeChanged,
    handleAccountSelected,
    handleTxSigned,
    handleGasSelectorChange,
    deployContractsState
  } = useStateReducer(DeployContractsFactory, deployContractsInitialState);

  const { account }: DeployContractsState = deployContractsState;

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
        onSuccess: (payload: ITxReceipt | ISignedTx) => handleTxSigned(payload, goToNextStep)
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
      heading={stepObject.title}
    >
      <StepComponent {...stepProps} {...stepActions} />
    </ExtendedContentPanel>
  );
};

export default withRouter(DeployContractsFlow);
