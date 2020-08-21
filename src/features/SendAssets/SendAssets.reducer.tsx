import { hexlify } from 'ethers/utils';
import { ValuesType } from 'utility-types';

import {
  ITxObject,
  Asset,
  TAddress,
  ITxConfig,
  ITxReceipt,
  ISignedTx,
  ITxHash,
  ITxType,
  TAction
} from '@types';
import {
  getBaseAssetByNetwork,
  hexWeiToString,
  bigNumGasPriceToViewableGwei,
  inputGasPriceToHex
} from '@services';
import { makePendingTxReceipt, makeTxConfigFromSignedTx, bigify } from '@utils';

import { processFormDataToTx } from './helpers';

interface State {
  type?: 'resubmit';
  txConfig?: ITxConfig;
  txReceipt?: ITxReceipt;
  signedTx?: ISignedTx;
  send?: boolean;
}

export type ReducerAction = TAction<ValuesType<typeof sendAssetsReducer.actionTypes>, any>;

// @ts-ignore
export const initialState: State = { txConfig: {} };

export const sendAssetsReducer = (state: State, action: ReducerAction): State => {
  switch (action.type) {
    case sendAssetsReducer.actionTypes.FORM_SUBMIT: {
      const { form, assets } = action.payload;
      const rawTransaction: ITxObject = processFormDataToTx(form);
      const baseAsset: Asset | undefined = getBaseAssetByNetwork({
        network: form.network,
        assets
      });
      const txConfig = {
        rawTransaction,
        amount: form.amount,
        senderAccount: form.account,
        receiverAddress: form.address.value as TAddress,
        network: form.network,
        asset: form.asset,
        baseAsset: baseAsset || ({} as Asset),
        from: form.account.address,
        gasPrice: hexWeiToString(rawTransaction.gasPrice),
        gasLimit: form.gasLimitField,
        nonce: form.nonceField,
        data: rawTransaction.data,
        value: hexWeiToString(rawTransaction.value)
      };
      return { ...state, txConfig };
    }

    case sendAssetsReducer.actionTypes.SET_TXCONFIG: {
      const { txConfig, type } = action.payload;
      return { ...state, type, txConfig };
    }

    case sendAssetsReducer.actionTypes.SIGN_SUCCESS: {
      const { assets, networks, accounts } = action.payload;
      const signedTx = hexlify(action.payload.signedTx);
      // Used when signedTx is a buffer instead of a string.
      // Hardware wallets return a buffer.´
      const txConfig = makeTxConfigFromSignedTx(
        action.payload.signedTx,
        assets,
        networks,
        accounts,
        state.txConfig
      );

      return { ...state, txConfig, signedTx };
    }

    case sendAssetsReducer.actionTypes.WEB3_SIGN_SUCCESS: {
      const txReceipt = createPendingTxReceipt(state, action.payload);
      return { ...state, txReceipt };
    }

    case sendAssetsReducer.actionTypes.REQUEST_SEND: {
      return { ...state, send: true };
    }

    case sendAssetsReducer.actionTypes.SEND_SUCCESS: {
      const { signedTx } = state;
      // @todo: Handle this error state.
      const txReceipt = signedTx
        ? createPendingTxReceipt(state, action.payload.hash as ITxHash)
        : undefined;
      return { ...state, send: false, txReceipt };
    }

    case sendAssetsReducer.actionTypes.REQUEST_RESUBMIT: {
      const { txConfig: prevTxConfig } = state;
      const rawTransaction = prevTxConfig!.rawTransaction;

      // add 10 gwei to current gas price
      const resubmitGasPrice =
        parseFloat(bigNumGasPriceToViewableGwei(bigify(rawTransaction.gasPrice))) + 10;
      const hexGasPrice = inputGasPriceToHex(resubmitGasPrice.toString());

      const txConfig = {
        ...prevTxConfig!,
        rawTransaction: { ...rawTransaction, gasPrice: hexGasPrice }
      };
      return { ...state, txConfig };
    }

    case sendAssetsReducer.actionTypes.RESET:
      return initialState;
    default:
      return state;
  }
};

sendAssetsReducer.actionTypes = {
  FORM_SUBMIT: 'FORM_SUBMIT',
  SIGN_SUCCESS: 'SIGN_SUCCESS',
  WEB3_SIGN_SUCCESS: 'WEB3_SIGN_SUCCESS',
  REQUEST_SEND: 'REQUEST_SEND',
  SEND_SUCCESS: 'SEND_SUCCESS',
  REQUEST_RESUBMIT: 'REQUEST_RESUBMIT',
  RESET: 'RESET',
  SET_TXCONFIG: 'SET_TXCONFIG'
};

const createPendingTxReceipt = (state: State, payload: ITxHash) => {
  return makePendingTxReceipt(payload)(ITxType.STANDARD, state.txConfig!);
};
