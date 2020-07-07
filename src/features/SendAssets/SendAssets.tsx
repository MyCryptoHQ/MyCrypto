import React, { useContext } from 'react';

import { GeneralStepper, TxReceiptWithProtectTx } from '@components';
import { useStateReducer, isWeb3Wallet, withProtectTxProvider } from '@utils';
import { ITxReceipt, ISignedTx, IFormikFields, ITxConfig } from '@types';
import { translateRaw } from '@translations';
import { ROUTE_PATHS } from '@config';
import { IStepperPath } from '@components/GeneralStepper/types';
import { ProtectTxContext } from '@features/ProtectTransaction/ProtectTxProvider';
import { StoreContext } from '@services';

import { txConfigInitialState, TxConfigFactory } from './stateFactory';
import {
  ConfirmTransactionWithProtectTx,
  SendAssetsFormWithProtectTx,
  SignTransactionWithProtectTx
} from './components';

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
  const {
    state: { protectTxEnabled, protectTxShow },
    setProtectTxTimeoutFunction
  } = useContext(ProtectTxContext);
  const { isMyCryptoMember } = useContext(StoreContext);

  // Due to MetaMask deprecating eth_sign method,
  // it has different step order, where sign and send are one panel
  const web3Steps: IStepperPath[] = [
    {
      label: 'Send Assets',
      component: SendAssetsFormWithProtectTx,
      props: (({ txConfig }) => ({ txConfig }))(txFactoryState),
      actions: (payload: IFormikFields, cb: any) => {
        if (protectTxEnabled && !isMyCryptoMember) {
          payload.nonceField = (parseInt(payload.nonceField, 10) + 1).toString();
        }
        return handleFormSubmit(payload, cb);
      }
    },
    {
      label: translateRaw('CONFIRM_TX_MODAL_TITLE'),
      component: ConfirmTransactionWithProtectTx,
      props: (({ txConfig }) => ({ txConfig }))(txFactoryState),
      actions: (payload: ITxConfig, cb: any) => handleConfirmAndSign(payload, cb)
    },
    {
      label: '',
      component: SignTransactionWithProtectTx,
      props: (({ txConfig }) => ({ txConfig }))(txFactoryState),
      actions: (payload: ITxReceipt | ISignedTx, cb: any) => handleSignedWeb3Tx(payload, cb)
    },
    {
      label: translateRaw('TRANSACTION_BROADCASTED'),
      component: TxReceiptWithProtectTx,
      props: (({ txConfig, txReceipt }) => ({ txConfig, txReceipt }))(txFactoryState)
    }
  ];

  const defaultSteps: IStepperPath[] = [
    {
      label: 'Send Assets',
      component: SendAssetsFormWithProtectTx,
      props: (({ txConfig }) => ({ txConfig }))(txFactoryState),
      actions: (payload: IFormikFields, cb: any) => {
        if (protectTxEnabled && !isMyCryptoMember) {
          payload.nonceField = (parseInt(payload.nonceField, 10) + 1).toString();
        }
        return handleFormSubmit(payload, cb);
      }
    },
    {
      label: '',
      component: SignTransactionWithProtectTx,
      props: (({ txConfig }) => ({ txConfig }))(txFactoryState),
      actions: (payload: ITxConfig | ISignedTx, cb: any) => handleSignedTx(payload, cb)
    },
    {
      label: translateRaw('CONFIRM_TX_MODAL_TITLE'),
      component: ConfirmTransactionWithProtectTx,
      props: (({ txConfig, signedTx }) => ({ txConfig, signedTx }))(txFactoryState),
      actions: (payload: ITxConfig | ISignedTx, cb: any) => {
        if (setProtectTxTimeoutFunction) {
          setProtectTxTimeoutFunction((txReceiptCb?: (txReciept: ITxReceipt) => void) =>
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
      component: TxReceiptWithProtectTx,
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
      wrapperClassName={`send-assets-stepper ${protectTxShow ? 'has-side-panel' : ''}`}
    />
  );
}

export default withProtectTxProvider(SendAssets);
