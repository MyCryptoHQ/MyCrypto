import { SavedTransaction, TransactionData, TransactionReceipt } from 'types/transactions';

export enum TypeKeys {
  TRANSACTIONS_FETCH_TRANSACTION_DATA = 'TRANSACTIONS_FETCH_TRANSACTION_DATA',
  TRANSACTIONS_SET_TRANSACTION_DATA = 'TRANSACTIONS_SET_TRANSACTION_DATA',
  TRANSACTIONS_SET_TRANSACTION_ERROR = 'TRANSACTIONS_SET_TRANSACTION_ERROR',
  TRANSACTIONS_RESET_TRANSACTION_DATA = 'TRANSACTIONS_RESET_TRANSACTION_DATA',
  TRANSACTIONS_ADD_RECENT_TRANSACTION = 'TRANSACTIONS_ADD_RECENT_TRANSACTION'
}

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

export interface AddRecentTransactionAction {
  type: TypeKeys.TRANSACTIONS_ADD_RECENT_TRANSACTION;
  payload: SavedTransaction;
}

/*** Union Type ***/
export type TransactionsAction =
  | FetchTransactionDataAction
  | SetTransactionDataAction
  | ResetTransactionDataAction
  | AddRecentTransactionAction;
