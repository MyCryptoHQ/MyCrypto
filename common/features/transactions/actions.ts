import {
  TypeKeys,
  FetchTransactionDataAction,
  SetTransactionDataAction,
  ResetTransactionDataAction,
  AddRecentTransactionAction
} from './types';

export type TFetchTransactionData = typeof fetchTransactionData;
export function fetchTransactionData(txhash: string): FetchTransactionDataAction {
  return {
    type: TypeKeys.TRANSACTIONS_FETCH_TRANSACTION_DATA,
    payload: txhash
  };
}

export type TSetTransactionData = typeof setTransactionData;
export function setTransactionData(
  payload: SetTransactionDataAction['payload']
): SetTransactionDataAction {
  return {
    type: TypeKeys.TRANSACTIONS_SET_TRANSACTION_DATA,
    payload
  };
}

export type TResetTransactionData = typeof resetTransactionData;
export function resetTransactionData(): ResetTransactionDataAction {
  return { type: TypeKeys.TRANSACTIONS_RESET_TRANSACTION_DATA };
}

export type TAddRecentTransaction = typeof addRecentTransaction;
export function addRecentTransaction(
  payload: AddRecentTransactionAction['payload']
): AddRecentTransactionAction {
  return {
    type: TypeKeys.TRANSACTIONS_ADD_RECENT_TRANSACTION,
    payload
  };
}
