import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router';

import { ContentPanel } from 'v2/components';
import { useStateReducer } from 'v2/utils';
import { WalletId, ITxReceipt, IFormikFields } from 'v2/types';
import { ROUTE_PATHS } from 'v2/config';
import { ConfirmTransaction, TransactionReceipt } from 'v2/components/TransactionFlow';
import { translateRaw } from 'v2/translations';

import { SendAssetsForm, SignTransaction } from './components';
import { txConfigInitialState, TxConfigFactory } from './stateFactory';
import { IPath } from './types';

function SendAssets({ history }: RouteComponentProps<{}>) {
  const [step, setStep] = useState(0);
  const {
    handleFormSubmit,
    handleConfirmAndSign,
    handleConfirmAndSend,
    handleSignedTx,
    handleSignedWeb3Tx,
    txConfig: txConfigState,
    txReceipt: txReceiptState
  } = useStateReducer(TxConfigFactory, { txConfig: txConfigInitialState, txReceipt: null });

  // tslint:disable-next-line
  const goToDashoard = () => {};

  // Due to MetaMask deprecating eth_sign method,
  // it has different step order, where sign and send are one panel
  const web3Steps: IPath[] = [
    { label: 'Send Assets', component: SendAssetsForm, action: handleFormSubmit },
    {
      label: translateRaw('CONFIRM_TX_MODAL_TITLE'),
      component: ConfirmTransaction,
      action: handleConfirmAndSign
    },
    { label: '', component: SignTransaction, action: handleSignedWeb3Tx },
    {
      label: translateRaw('TRANSACTION_BROADCASTED'),
      component: TransactionReceipt,
      action: goToDashoard
    }
  ];

  const defaultSteps: IPath[] = [
    { label: 'Send Assets', component: SendAssetsForm, action: handleFormSubmit },
    { label: '', component: SignTransaction, action: handleSignedTx },
    {
      label: translateRaw('CONFIRM_TX_MODAL_TITLE'),
      component: ConfirmTransaction,
      action: handleConfirmAndSend
    },
    {
      label: translateRaw('TRANSACTION_BROADCASTED'),
      component: TransactionReceipt,
      action: goToDashoard
    }
  ];

  const getStep = (walletId: WalletId, stepIndex: number) => {
    const path = walletId === WalletId.METAMASK ? web3Steps : defaultSteps;
    const { label, component, action } = path[stepIndex]; // tslint:disable-line
    return { currentPath: path, label, Step: component, stepAction: action };
  };

  const { senderAccount } = txConfigState;

  const { currentPath, label, Step, stepAction } = getStep(
    senderAccount ? senderAccount.wallet : undefined,
    step
  );
  const getBackBtnLabel = () =>
    Math.max(-1, step - 1) === -1
      ? translateRaw('DASHBOARD')
      : getStep(senderAccount ? senderAccount.wallet : undefined, Math.max(0, step - 1)).label;

  const goToNextStep = () => setStep(Math.min(step + 1, currentPath.length - 1));
  const goToPrevStep = () => setStep(Math.max(0, step - 1));
  const goToFirstStep = () => setStep(0);

  const goBack = () => (step === 0 ? history.push(ROUTE_PATHS.DASHBOARD.path) : goToPrevStep());

  return (
    <ContentPanel
      onBack={goBack}
      backBtnText={getBackBtnLabel()}
      heading={label}
      stepper={{ current: step + 1, total: currentPath.length }}
    >
      <Step
        txReceipt={txReceiptState}
        txConfig={txConfigState}
        onComplete={(payload: IFormikFields | ITxReceipt) => stepAction(payload, goToNextStep)}
        completeButtonText={translateRaw('SEND_ASSETS_SEND_ANOTHER')}
        resetFlow={goToFirstStep}
      />
    </ContentPanel>
  );
}

export default SendAssets;
