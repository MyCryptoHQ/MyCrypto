import { hexlify, bigNumberify, Arrayish } from 'ethers/utils';
import { TransactionResponse } from 'ethers/providers';
import { ValuesType } from 'utility-types';

import {
  IFormikFields,
  ITxObject,
  Asset,
  TAddress,
  ITxConfig,
  ITxReceipt,
  ISignedTx,
  ITxHash,
  ITxType,
  ExtendedAsset,
  Network,
  StoreAccount,
  TAction
} from '@types';
import {
  getBaseAssetByNetwork,
  hexWeiToString,
  bigNumGasPriceToViewableGwei,
  inputGasPriceToHex
} from '@services';
import { makePendingTxReceipt, makeTxConfigFromSignedTx } from '@utils';

import { processFormDataToTx } from './helpers';

interface State {
  txConfig?: ITxConfig;
  txReceipt?: ITxReceipt;
  signedTx?: ISignedTx;
  send?: boolean;
}

export type ReducerAction = TAction<ValuesType<typeof sendAssetsReducer.actionTypes>, any>;

// @ts-ignore
export const initialState: State = { txConfig: {} };

export const sendAssetsReducer = (state: State, action: ReducerAction) => {
  switch (action.type) {
    case sendAssetsReducer.actionTypes.FORM_SUBMIT: {
      const txConfig = handleFormSubmit(action.payload);
      return { ...state, txConfig };
    }
    case sendAssetsReducer.actionTypes.SIGN: {
      const { txConfig, signedTx } = handleSignedTx(state, action.payload);
      return { ...state, txConfig, signedTx };
    }
    case sendAssetsReducer.actionTypes.WEB3_SIGN: {
      const txReceipt = handleSignedWeb3Tx(state, action.payload);
      return { ...state, txReceipt };
    }
    case sendAssetsReducer.actionTypes.SEND: {
      return { ...state, send: true };
    }
    case sendAssetsReducer.actionTypes.AFTER_SEND: {
      const txReceipt = handleConfirmAndSend(state, action.payload);
      return { ...state, txReceipt };
    }
    case sendAssetsReducer.actionTypes.RESUBMIT: {
      const txConfig = handleResubmitTx(state);
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
  SIGN: 'SIGN',
  WEB3_SIGN: 'WEB3_SIGN',
  SEND: 'SEND',
  AFTER_SEND: 'AFTER_SEND',
  RESUBMIT: 'RESUBMIT',
  RESET: 'RESET'
};

const handleFormSubmit = (payload: { form: IFormikFields; assets: ExtendedAsset[] }) => {
  const { form, assets } = payload;
  const rawTransaction: ITxObject = processFormDataToTx(form);
  const baseAsset: Asset | undefined = getBaseAssetByNetwork({
    network: form.network,
    assets
  });
  return {
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
};

const handleSignedTx = (
  state: State,
  payload: {
    signedTx: Arrayish;
    assets: ExtendedAsset[];
    networks: Network[];
    accounts: StoreAccount[];
  }
) => {
  const { assets, networks, accounts } = payload;
  const signedTx = hexlify(payload.signedTx);
  // Used when signedTx is a buffer instead of a string.
  // Hardware wallets return a buffer.

  return {
    signedTx, // keep a reference to signedTx;
    txConfig: makeTxConfigFromSignedTx(payload.signedTx, assets, networks, accounts, state.txConfig)
  };
};

const handleSignedWeb3Tx = (state: State, payload: ITxHash) => {
  const pendingTxReceipt = makePendingTxReceipt(payload)(ITxType.STANDARD, state.txConfig!);
  return pendingTxReceipt;
};

const handleConfirmAndSend = (state: State, retrievedTxResponse: TransactionResponse) => {
  const { signedTx, txConfig } = state;
  if (!signedTx) {
    return; // @todo: Handle this error state.
  }

  const pendingTxReceipt = makePendingTxReceipt(retrievedTxResponse.hash as ITxHash)(
    ITxType.STANDARD,
    txConfig!
  );
  return pendingTxReceipt;
};

const handleResubmitTx = (state: State) => {
  const { txConfig } = state;
  const rawTransaction = txConfig!.rawTransaction;
  // add 10 gwei to current gas price
  const resubmitGasPrice =
    parseFloat(bigNumGasPriceToViewableGwei(bigNumberify(rawTransaction.gasPrice))) + 10;
  const hexGasPrice = inputGasPriceToHex(resubmitGasPrice.toString());

  return {
    ...txConfig!,
    rawTransaction: { ...rawTransaction, gasPrice: hexGasPrice }
  };
};
