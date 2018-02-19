import { TypeKeys } from './constants';
import { TransactionData, TransactionReceipt } from 'libs/nodes';
import { SavedTransaction } from 'utils/localStorage';

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

export interface ResetTransactionDataAction {
  type: TypeKeys.TRANSACTIONS_RESET_TRANSACTION_DATA;
}

export interface SetRecentTransactionsAction {
  type: TypeKeys.TRANSACTIONS_SET_RECENT_TRANSACTIONS;
  payload: SavedTransaction[];
}

/*** Union Type ***/
export type TransactionsAction =
  | FetchTransactionDataAction
  | SetTransactionDataAction
  | ResetTransactionDataAction
  | SetRecentTransactionsAction;
