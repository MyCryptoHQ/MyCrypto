import React, { useContext, useState } from 'react';

import {
  ConfirmTransaction,
  GeneralStepper,
  TxReceipt,
  TxReceiptWithProtectTx
} from 'v2/components';
import {
  isWeb3Wallet,
  withProtectTxProvider,
  useTxMulti,
  fromTxObjectToTxConfig,
  fromTxParcelToTxReceipt,
  getCurrentTxFromTxMulti
} from 'v2/utils';
import { ITxReceipt, IFormikFields, ITxConfig, ITxObject, ITxSigned, ITxHash } from 'v2/types';
import { translateRaw } from 'v2/translations';
import { IS_ACTIVE_FEATURE, ROUTE_PATHS } from 'v2/config';
import { IStepperPath } from 'v2/components/GeneralStepper/types';

import SendAssetsForm from './components/SendAssetsForm';
import {
  ConfirmTransactionWithProtectTx,
  SendAssetsFormWithProtectTx,
  SignTransaction,
  SignTransactionWithProtectTx
} from './components';
import { ProtectTxContext, ProtectTxUtils } from '../ProtectTransaction';
import { fromSendAssetFormDataToTxObject } from './helpers';
import { bigNumGasPriceToViewableGwei, inputGasPriceToHex } from '../../services/EthService/utils';
import { bigNumberify } from 'ethers/utils';

function SendAssets() {
  const [signedTx, setSignedTx] = useState<ITxHash | ITxSigned | null>(null);
  const { state, init, prepareTx, sendTx } = useTxMulti();
  const { transactions, _currentTxIdx, account, network } = state;

  const txParcel = getCurrentTxFromTxMulti(transactions, _currentTxIdx);
  const { txRaw } = txParcel;
  const txConfig = fromTxObjectToTxConfig(txRaw, account);
  const txReceipt = fromTxParcelToTxReceipt(txParcel, account);

  const protectTxContext = useContext(ProtectTxContext);
  const getProTxValue = ProtectTxUtils.isProtectTxDefined(protectTxContext);

  // Due to MetaMask deprecating eth_sign method,
  // it has different step order, where sign and send are one panel
  const web3Steps: IStepperPath[] = [
    {
      label: 'Send Assets',
      component: IS_ACTIVE_FEATURE.PROTECT_TX ? SendAssetsFormWithProtectTx : SendAssetsForm,
      props: ((trans, txId) => ({
        txConfig: trans.length && trans[txId].txRaw
      }))(transactions, _currentTxIdx),
      actions: async (payload: IFormikFields, cb: any) => {
        if (getProTxValue(['state', 'protectTxEnabled'])) {
          payload.nonceField = (parseInt(payload.nonceField, 10) + 1).toString();
        }

        const { account: formAccount, network: formNetwork } = payload;
        await init([{}], formAccount, formNetwork);

        const rawTransaction: ITxObject = fromSendAssetFormDataToTxObject(payload);
        await prepareTx(rawTransaction);

        if (cb) {
          cb();
        }
      }
    },
    {
      label: translateRaw('CONFIRM_TX_MODAL_TITLE'),
      component: IS_ACTIVE_FEATURE.PROTECT_TX
        ? ConfirmTransactionWithProtectTx
        : ConfirmTransaction,
      props: { txConfig, signedTx },
      actions: (_: ITxConfig, cb: any) => {
        if (cb) {
          cb();
        }
      }
    },
    {
      label: '',
      component: IS_ACTIVE_FEATURE.PROTECT_TX ? SignTransactionWithProtectTx : SignTransaction,
      props: {
        txConfig
      },
      actions: async (payload: ITxSigned, cb: any) => {
        await sendTx(payload as ITxHash);
        if (cb) {
          cb();
        }
      }
    },
    {
      label: translateRaw('TRANSACTION_BROADCASTED'),
      component: IS_ACTIVE_FEATURE.PROTECT_TX ? TxReceiptWithProtectTx : TxReceipt,
      props: {
        txConfig,
        txReceipt
      }
    }
  ];

  const defaultSteps: IStepperPath[] = [
    {
      label: 'Send Assets',
      component: IS_ACTIVE_FEATURE.PROTECT_TX ? SendAssetsFormWithProtectTx : SendAssetsForm,
      props: ((trans, txId) => ({
        txConfig: trans.length && trans[txId].txRaw
      }))(transactions, _currentTxIdx),
      actions: async (payload: IFormikFields, cb: any) => {
        if (getProTxValue(['state', 'protectTxEnabled'])) {
          payload.nonceField = (parseInt(payload.nonceField, 10) + 1).toString();
        }

        const { account: formAccount, network: formNetwork } = payload;
        await init([{}], formAccount, formNetwork);

        const rawTransaction: ITxObject = fromSendAssetFormDataToTxObject(payload);
        await prepareTx(rawTransaction);

        if (cb) {
          cb();
        }
      }
    },
    {
      label: '',
      component: IS_ACTIVE_FEATURE.PROTECT_TX ? SignTransactionWithProtectTx : SignTransaction,
      props: {
        txConfig
      },
      actions: async (payload: ITxSigned, cb: any) => {
        setSignedTx(payload as ITxHash);
        if (cb) {
          cb();
        }
      }
    },
    {
      label: translateRaw('CONFIRM_TX_MODAL_TITLE'),
      component: IS_ACTIVE_FEATURE.PROTECT_TX
        ? ConfirmTransactionWithProtectTx
        : ConfirmTransaction,
      props: { txConfig, signedTx },
      actions: async (_: ITxConfig | ITxSigned, cb: any) => {
        if (getProTxValue(['setProtectTxTimeoutFunction'])) {
          getProTxValue(['setProtectTxTimeoutFunction'])(
            async (txReceiptCb?: (txReciept: ITxReceipt) => void) => {
              await sendTx(signedTx as ITxSigned);
              if (txReceiptCb) {
                txReceiptCb(txReceipt!);
              }
            }
          );
        } else {
          await sendTx(signedTx as ITxSigned);
        }
        if (cb) {
          cb();
        }
      }
    },
    {
      label: ' ',
      component: IS_ACTIVE_FEATURE.PROTECT_TX ? TxReceiptWithProtectTx : TxReceipt,
      props: {
        txConfig,
        txReceipt,
        pendingButton: {
          text: translateRaw('TRANSACTION_BROADCASTED_RESUBMIT'),
          action: async (cb: any) => {
            await init([{}], account, network);

            const { gasPrice } = txRaw;

            const resubmitGasPrice =
              parseFloat(bigNumGasPriceToViewableGwei(bigNumberify(gasPrice))) + 10;
            const hexGasPrice = inputGasPriceToHex(resubmitGasPrice.toString());

            await prepareTx({
              ...txRaw,
              nonce: hexGasPrice
            });

            cb();
          }
        }
      }
    }
  ];

  const getPath = () => {
    return account && isWeb3Wallet(account.wallet) ? web3Steps : defaultSteps;
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

export default IS_ACTIVE_FEATURE.PROTECT_TX ? withProtectTxProvider()(SendAssets) : SendAssets;
