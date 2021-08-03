import { hexlify } from '@ethersproject/bytes';
import { ValuesType } from 'utility-types';

import { makePendingTxReceipt, makeTxConfigFromSignedTx } from '@helpers';
import { getBaseAssetByNetwork } from '@services/Store/Network';
import {
  Asset,
  ISignedTx,
  ITxConfig,
  ITxHash,
  ITxObject,
  ITxReceipt,
  ITxType,
  TAction,
  TAddress,
  TxQueryTypes
} from '@types';

import { processFormDataToTx } from './helpers';

interface State {
  txNumber: number;
  txQueryType?: TxQueryTypes;
  txConfig?: ITxConfig;
  txReceipt?: ITxReceipt;
  signedTx?: ISignedTx;
  send?: boolean;
}

export type ReducerAction = TAction<ValuesType<typeof sendAssetsReducer.actionTypes>, any>;

// @ts-expect-error: @todo Flow shouldn't rely on txConfig being an empty object
export const initialState: State = { txConfig: {}, txNumber: 0 };

export const sendAssetsReducer = (state: State, action: ReducerAction): State => {
  switch (action.type) {
    case sendAssetsReducer.actionTypes.FORM_SUBMIT: {
      const { form, assets } = action.payload;
      const rawTransaction: ITxObject = processFormDataToTx(form);
      const baseAsset: Asset | undefined = getBaseAssetByNetwork({
        network: form.network,
        assets
      });
      const txConfig: ITxConfig = {
        rawTransaction,
        amount: form.amount,
        senderAccount: form.account,
        receiverAddress: form.address.value as TAddress,
        networkId: form.network.id,
        asset: form.asset,
        baseAsset: baseAsset || ({} as Asset),
        from: form.account.address
      };
      return { ...state, txConfig };
    }

    case sendAssetsReducer.actionTypes.SET_TXCONFIG: {
      const { txConfig, txQueryType } = action.payload;
      return { txQueryType, txConfig, txNumber: state.txNumber + 1 };
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
        state.txConfig?.networkId
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
  RESET: 'RESET',
  SET_TXCONFIG: 'SET_TXCONFIG'
};

const createPendingTxReceipt = (state: State, payload: ITxHash) => {
  return makePendingTxReceipt(payload)(ITxType.STANDARD, state.txConfig!);
};
