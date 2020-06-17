import React, { useContext } from 'react';

import { ConfirmTransaction, GeneralStepper, TxReceipt, TxReceiptWithProtectTx } from '@components';
import { useStateReducer, isWeb3Wallet, withProtectTxProvider } from '@utils';
import { ITxReceipt, ISignedTx, IFormikFields, ITxConfig } from '@types';
import { translateRaw } from '@translations';
import { IS_ACTIVE_FEATURE, ROUTE_PATHS } from '@config';
import { IStepperPath } from '@components/GeneralStepper/types';

import { txConfigInitialState, TxConfigFactory } from './stateFactory';
import SendAssetsForm from './components/SendAssetsForm';
import {
  ConfirmTransactionWithProtectTx,
  SendAssetsFormWithProtectTx,
  SignTransactionWithProtectTx
} from './components';
import SignTransaction from './components/SignTransaction';
import { ProtectTxContext } from '@features/ProtectTransaction/ProtectTxProvider';
import { ProtectTxUtils } from '@features/ProtectTransaction';

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
  const protectTxContext = useContext(ProtectTxContext);
  const getProTxValue = ProtectTxUtils.isProtectTxDefined(protectTxContext);

  // Due to MetaMask deprecating eth_sign method,
  // it has different step order, where sign and send are one panel
  const web3Steps: IStepperPath[] = [
    {
      label: 'Send Assets',
      component: IS_ACTIVE_FEATURE.PROTECT_TX ? SendAssetsFormWithProtectTx : SendAssetsForm,
      props: (({ txConfig }) => ({ txConfig }))(txFactoryState),
      actions: (payload: IFormikFields, cb: any) => {
        if (getProTxValue(['state', 'protectTxEnabled'])) {
          payload.nonceField = (parseInt(payload.nonceField, 10) + 1).toString();
        }
        return handleFormSubmit(payload, cb);
      }
    },
    {
      label: translateRaw('CONFIRM_TX_MODAL_TITLE'),
      component: IS_ACTIVE_FEATURE.PROTECT_TX
        ? ConfirmTransactionWithProtectTx
        : ConfirmTransaction,
      props: (({ txConfig }) => ({ txConfig }))(txFactoryState),
      actions: (payload: ITxConfig, cb: any) => handleConfirmAndSign(payload, cb)
    },
    {
      label: '',
      component: IS_ACTIVE_FEATURE.PROTECT_TX ? SignTransactionWithProtectTx : SignTransaction,
      props: (({ txConfig }) => ({ txConfig }))(txFactoryState),
      actions: (payload: ITxReceipt | ISignedTx, cb: any) => handleSignedWeb3Tx(payload, cb)
    },
    {
      label: translateRaw('TRANSACTION_BROADCASTED'),
      component: IS_ACTIVE_FEATURE.PROTECT_TX ? TxReceiptWithProtectTx : TxReceipt,
      props: (({ txConfig, txReceipt }) => ({ txConfig, txReceipt }))(txFactoryState)
    }
  ];

  const defaultSteps: IStepperPath[] = [
    {
      label: 'Send Assets',
      component: IS_ACTIVE_FEATURE.PROTECT_TX ? SendAssetsFormWithProtectTx : SendAssetsForm,
      props: (({ txConfig }) => ({ txConfig }))(txFactoryState),
      actions: (payload: IFormikFields, cb: any) => {
        if (getProTxValue(['state', 'protectTxEnabled'])) {
          payload.nonceField = (parseInt(payload.nonceField, 10) + 1).toString();
        }
        return handleFormSubmit(payload, cb);
      }
    },
    {
      label: '',
      component: IS_ACTIVE_FEATURE.PROTECT_TX ? SignTransactionWithProtectTx : SignTransaction,
      props: (({ txConfig }) => ({ txConfig }))(txFactoryState),
      actions: (payload: ITxConfig | ISignedTx, cb: any) => handleSignedTx(payload, cb)
    },
    {
      label: translateRaw('CONFIRM_TX_MODAL_TITLE'),
      component: IS_ACTIVE_FEATURE.PROTECT_TX
        ? ConfirmTransactionWithProtectTx
        : ConfirmTransaction,
      props: (({ txConfig, signedTx }) => ({ txConfig, signedTx }))(txFactoryState),
      actions: (payload: ITxConfig | ISignedTx, cb: any) => {
        if (getProTxValue(['setProtectTxTimeoutFunction'])) {
          getProTxValue(['setProtectTxTimeoutFunction'])(
            (txReceiptCb?: (txReciept: ITxReceipt) => void) =>
              handleConfirmAndSend(payload, (txReceipt: ITxReceipt) => {
                if (txReceiptCb) {
                  txReceiptCb(txReceipt);
                }
              })
          );
        } else {
          handleConfirmAndSend(payload);
        }
        if (cb) {
          cb();
        }
      }
    },
    {
      label: ' ',
      component: IS_ACTIVE_FEATURE.PROTECT_TX ? TxReceiptWithProtectTx : TxReceipt,
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
      wrapperClassName={`send-assets-stepper ${
        getProTxValue(['state', 'protectTxShow']) ? 'has-side-panel' : ''
      }`}
    />
  );
}

export default IS_ACTIVE_FEATURE.PROTECT_TX ? withProtectTxProvider(SendAssets) : SendAssets;
