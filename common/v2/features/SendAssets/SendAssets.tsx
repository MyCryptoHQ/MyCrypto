import React from 'react';

import { GeneralStepper } from 'v2/components';
import { useStateReducer } from 'v2/utils';
import { WalletId, ITxReceipt, ISignedTx, IFormikFields, ITxConfig } from 'v2/types';
import { ConfirmTransaction, TransactionReceipt } from 'v2/components/TransactionFlow';
import { translateRaw } from 'v2/translations';

import { SendAssetsForm, SignTransaction } from './components';
import { txConfigInitialState, TxConfigFactory } from './stateFactory';
import { IStepperPath } from 'v2/components/GeneralStepper/types';
import { ROUTE_PATHS } from 'v2/config';

function SendAssets() {
  const {
    handleFormSubmit,
    handleConfirmAndSign,
    handleConfirmAndSend,
    handleSignedTx,
    handleSignedWeb3Tx,
    txFactoryState
  } = useStateReducer(TxConfigFactory, { txConfig: txConfigInitialState, txReceipt: null });

  // goToDashboard is defaulted to do-nothing, because goToNextStep handles redirect location.
  // tslint:disable-next-line
  const goToDashboard = () => {};

  // Due to MetaMask deprecating eth_sign method,
  // it has different step order, where sign and send are one panel
  const web3Steps: IStepperPath[] = [
    {
      label: 'Send Assets',
      component: SendAssetsForm,
      props: (({ txConfig }) => ({ txConfig }))(txFactoryState),
      actions: (payload: IFormikFields, cb: any) => handleFormSubmit(payload, cb)
    },
    {
      label: translateRaw('CONFIRM_TX_MODAL_TITLE'),
      component: ConfirmTransaction,
      props: (({ txConfig }) => ({ txConfig }))(txFactoryState),
      actions: (payload: ITxConfig, cb: any) => handleConfirmAndSign(payload, cb)
    },
    {
      label: '',
      component: SignTransaction,
      props: (({ txConfig }) => ({ txConfig }))(txFactoryState),
      actions: (payload: ITxReceipt | ISignedTx, cb: any) => handleSignedWeb3Tx(payload, cb)
    },
    {
      label: translateRaw('TRANSACTION_BROADCASTED'),
      component: TransactionReceipt,
      actions: goToDashboard,
      props: (({ txConfig, txReceipt }) => ({ txConfig, txReceipt }))(txFactoryState)
    }
  ];

  const defaultSteps: IStepperPath[] = [
    {
      label: 'Send Assets',
      component: SendAssetsForm,
      props: (({ txConfig }) => ({ txConfig }))(txFactoryState),
      actions: (payload: IFormikFields, cb: any) => handleFormSubmit(payload, cb)
    },
    {
      label: '',
      component: SignTransaction,
      props: (({ txConfig }) => ({ txConfig }))(txFactoryState),
      actions: (payload: ITxConfig | ISignedTx, cb: any) => handleSignedTx(payload, cb)
    },
    {
      label: translateRaw('CONFIRM_TX_MODAL_TITLE'),
      component: ConfirmTransaction,
      props: (({ txConfig }) => ({ txConfig }))(txFactoryState),
      actions: (payload: ITxConfig | ISignedTx, cb: any) => handleConfirmAndSend(payload, cb)
    },
    {
      label: translateRaw('TRANSACTION_BROADCASTED'),
      component: TransactionReceipt,
      actions: goToDashboard,
      props: (({ txConfig, txReceipt }) => ({ txConfig, txReceipt }))(txFactoryState)
    }
  ];

  const { senderAccount } = txFactoryState && txFactoryState.txConfig;

  const walletId = senderAccount ? senderAccount.wallet : undefined;
  const steps = walletId === WalletId.METAMASK ? web3Steps : defaultSteps;

  return (
    <GeneralStepper
      steps={steps}
      defaultBackPath={ROUTE_PATHS.DASHBOARD.path}
      defaultBackPathLabel={translateRaw('DASHBOARD')}
      completeBtnText={translateRaw('SEND_ASSETS_SEND_ANOTHER')}
    />
  );
}

export default SendAssets;
