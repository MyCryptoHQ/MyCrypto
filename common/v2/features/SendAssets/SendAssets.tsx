import React, { useState } from 'react';

import sendIcon from 'common/assets/images/icn-send.svg';
import { ContentPanel } from 'v2/components';
import { useStateReducer } from 'v2/utils';
import { WalletId, ITxReceipt } from 'v2/types';
import {
  ConfirmTransaction,
  SendAssetsForm,
  SignTransaction,
  TransactionReceipt
} from './components';
import { txConfigInitialState, TxConfigFactory } from './stateFactory';
import { IFormikFields, IPath } from './types';
import { translateRaw } from 'translations';

function SendAssets() {
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
      label: 'Confirm Transaction',
      component: ConfirmTransaction,
      action: handleConfirmAndSign
    },
    { label: '', component: SignTransaction, action: handleSignedWeb3Tx },
    { label: 'Transaction Complete', component: TransactionReceipt, action: goToDashoard }
  ];

  const defaultSteps: IPath[] = [
    { label: 'Send Assets', component: SendAssetsForm, action: handleFormSubmit },
    { label: '', component: SignTransaction, action: handleSignedTx },
    { label: 'Confirm Transaction', component: ConfirmTransaction, action: handleConfirmAndSend },
    { label: 'Transaction Complete', component: TransactionReceipt, action: goToDashoard }
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

  const goToNextStep = () => setStep(Math.min(step + 1, currentPath.length - 1));
  const goToPrevStep = () => setStep(Math.max(0, step - 1));

  return (
    <ContentPanel
      onBack={goToPrevStep}
      className="SendAssets"
      heading={label}
      icon={sendIcon}
      stepper={{ current: step + 1, total: currentPath.length - 1 }}
    >
      <Step
        txReceipt={txReceiptState}
        txConfig={txConfigState}
        onComplete={(payload: IFormikFields | ITxReceipt) => stepAction(payload, goToNextStep)}
        completeButtonText={translateRaw('SEND_ASSETS_SEND_ANOTHER')}
      />
    </ContentPanel>
  );
}

export default SendAssets;
