import * as transactionsTypes from './types';

export type TFetchTransactionData = typeof fetchTransactionData;
export function fetchTransactionData(txhash: string): transactionsTypes.FetchTransactionDataAction {
  return {
    type: transactionsTypes.TransactionsActions.FETCH_TRANSACTION_DATA,
    payload: txhash
  };
}

export type TSetTransactionData = typeof setTransactionData;
export function setTransactionData(
  payload: transactionsTypes.SetTransactionDataAction['payload']
): transactionsTypes.SetTransactionDataAction {
  return {
    type: transactionsTypes.TransactionsActions.SET_TRANSACTION_DATA,
    payload
  };
}

export type TResetTransactionData = typeof resetTransactionData;
export function resetTransactionData(): transactionsTypes.ResetTransactionDataAction {
  return { type: transactionsTypes.TransactionsActions.RESET_TRANSACTION_DATA };
}

export type TAddRecentTransaction = typeof addRecentTransaction;
export function addRecentTransaction(
  payload: transactionsTypes.AddRecentTransactionAction['payload']
): transactionsTypes.AddRecentTransactionAction {
  return {
    type: transactionsTypes.TransactionsActions.ADD_RECENT_TRANSACTION,
    payload
  };
}
