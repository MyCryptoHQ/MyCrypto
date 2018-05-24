import {
  SavedTransaction,
  TransactionData,
  TransactionReceipt,
  TransactionState
} from 'types/transactions';

export interface TransactionsState {
  txData: { [txhash: string]: TransactionState };
  recent: SavedTransaction[];
}

export enum TRANSACTIONS {
  FETCH_TRANSACTION_DATA = 'TRANSACTIONS_FETCH_TRANSACTION_DATA',
  SET_TRANSACTION_DATA = 'TRANSACTIONS_SET_TRANSACTION_DATA',
  SET_TRANSACTION_ERROR = 'TRANSACTIONS_SET_TRANSACTION_ERROR',
  RESET_TRANSACTION_DATA = 'TRANSACTIONS_RESET_TRANSACTION_DATA',
  ADD_RECENT_TRANSACTION = 'TRANSACTIONS_ADD_RECENT_TRANSACTION'
}

export interface FetchTransactionDataAction {
  type: TRANSACTIONS.FETCH_TRANSACTION_DATA;
  payload: string;
}

export interface SetTransactionDataAction {
  type: TRANSACTIONS.SET_TRANSACTION_DATA;
  payload: {
    txhash: string;
    data: TransactionData | null;
    receipt: TransactionReceipt | null;
    error: string | null;
  };
}

export interface ResetTransactionDataAction {
  type: TRANSACTIONS.RESET_TRANSACTION_DATA;
}

export interface AddRecentTransactionAction {
  type: TRANSACTIONS.ADD_RECENT_TRANSACTION;
  payload: SavedTransaction;
}

/*** Union Type ***/
export type TransactionsAction =
  | FetchTransactionDataAction
  | SetTransactionDataAction
  | ResetTransactionDataAction
  | AddRecentTransactionAction;
