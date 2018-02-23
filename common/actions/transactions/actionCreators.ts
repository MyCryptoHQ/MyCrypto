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
