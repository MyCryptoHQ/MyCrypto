import { TypeKeys } from './constants';
import { TransactionData, TransactionReceipt } from 'libs/nodes';

export interface FetchTransactionDataAction {
  type: TypeKeys.TRANSACTIONS_FETCH_TRANSACTION_DATA;
  payload: string;
}

export interface SetTransactionDataAction {
  type: TypeKeys.TRANSACTIONS_SET_TRANSACTION_DATA;
  payload: {
    txhash: string;
    data: TransactionData | null;
    receipt: TransactionReceipt | null;
    error: string | null;
  };
}

/*** Union Type ***/
export type TransactionsAction = FetchTransactionDataAction | SetTransactionDataAction;
