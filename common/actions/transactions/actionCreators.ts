import * as interfaces from './actionTypes';
import { TypeKeys } from './constants';

export type TFetchTransactionData = typeof fetchTransactionData;
export function fetchTransactionData(txhash: string): interfaces.FetchTransactionDataAction {
  return {
    type: TypeKeys.TRANSACTIONS_FETCH_TRANSACTION_DATA,
    payload: txhash
  };
}

export type TSetTransactionData = typeof setTransactionData;
export function setTransactionData(
  payload: interfaces.SetTransactionDataAction['payload']
): interfaces.SetTransactionDataAction {
  return {
    type: TypeKeys.TRANSACTIONS_SET_TRANSACTION_DATA,
    payload
  };
}

export type TResetTransactionData = typeof resetTransactionData;
export function resetTransactionData(): interfaces.ResetTransactionDataAction {
  return { type: TypeKeys.TRANSACTIONS_RESET_TRANSACTION_DATA };
}

export type TSetRecentTransactions = typeof setRecentTransactions;
export function setRecentTransactions(
  payload: interfaces.SetRecentTransactionsAction['payload']
): interfaces.SetRecentTransactionsAction {
  return {
    type: TypeKeys.TRANSACTIONS_SET_RECENT_TRANSACTIONS,
    payload
  };
}
