import * as types from './types';

export type TFetchTransactionData = typeof fetchTransactionData;
export function fetchTransactionData(txhash: string): types.FetchTransactionDataAction {
  return {
    type: types.TransactionsActions.FETCH_TRANSACTION_DATA,
    payload: txhash
  };
}

export type TSetTransactionData = typeof setTransactionData;
export function setTransactionData(
  payload: types.SetTransactionDataAction['payload']
): types.SetTransactionDataAction {
  return {
    type: types.TransactionsActions.SET_TRANSACTION_DATA,
    payload
  };
}

export type TResetTransactionData = typeof resetTransactionData;
export function resetTransactionData(): types.ResetTransactionDataAction {
  return { type: types.TransactionsActions.RESET_TRANSACTION_DATA };
}

export type TAddRecentTransaction = typeof addRecentTransaction;
export function addRecentTransaction(
  payload: types.AddRecentTransactionAction['payload']
): types.AddRecentTransactionAction {
  return {
    type: types.TransactionsActions.ADD_RECENT_TRANSACTION,
    payload
  };
}
