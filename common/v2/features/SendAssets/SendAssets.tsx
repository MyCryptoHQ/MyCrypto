import React from 'react';

import { GeneralStepper } from 'v2/components';
import { useStateReducer, isWeb3Wallet } from 'v2/utils';
import { ITxReceipt, ISignedTx, IFormikFields, ITxConfig } from 'v2/types';
import { translateRaw } from 'v2/translations';
import { ROUTE_PATHS } from 'v2/config';

import { ConfirmTransaction, TxReceipt } from 'v2/components/TransactionFlow';
import { IStepperPath } from 'v2/components/GeneralStepper/types';
import { SendAssetsForm, SignTransaction } from './components';
import { txConfigInitialState, TxConfigFactory } from './stateFactory';

function SendAssets() {
  const {
    handleFormSubmit,
    handleConfirmAndSign,
    handleConfirmAndSend,
    handleSignedTx,
    handleSignedWeb3Tx,
    handleResubmitTx,
    txFactoryState
  } = useStateReducer(TxConfigFactory, { txConfig: txConfigInitialState, txReceipt: undefined });

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
      component: TxReceipt,
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
      props: (({ txConfig, signedTx }) => ({ txConfig, signedTx }))(txFactoryState),
      actions: (payload: ITxConfig | ISignedTx, cb: any) => handleConfirmAndSend(payload, cb)
    },
    {
      label: translateRaw('TRANSACTION_BROADCASTED'),
      component: TxReceipt,
      props: (({ txConfig, txReceipt }) => ({
        txConfig,
        txReceipt,
        pendingButton: {
          text: translateRaw('TRANSACTION_BROADCASTED_RESUBMIT'),
          action: (cb: any) => handleResubmitTx(cb)
        }
      }))(txFactoryState)
    }
  ];

  const getPath = () => {
    const { senderAccount } = txFactoryState.txConfig;
    return senderAccount && isWeb3Wallet(senderAccount.wallet) ? web3Steps : defaultSteps;
  };

  return (
    <GeneralStepper
      steps={getPath()}
      defaultBackPath={ROUTE_PATHS.DASHBOARD.path}
      defaultBackPathLabel={translateRaw('DASHBOARD')}
      completeBtnText={translateRaw('SEND_ASSETS_SEND_ANOTHER')}
    />
  );
}

export default SendAssets;
