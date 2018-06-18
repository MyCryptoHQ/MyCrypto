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

export enum TransactionsActions {
  FETCH_TRANSACTION_DATA = 'TransactionsActions_FETCH_TRANSACTION_DATA',
  SET_TRANSACTION_DATA = 'TransactionsActions_SET_TRANSACTION_DATA',
  SET_TRANSACTION_ERROR = 'TransactionsActions_SET_TRANSACTION_ERROR',
  RESET_TRANSACTION_DATA = 'TransactionsActions_RESET_TRANSACTION_DATA',
  ADD_RECENT_TRANSACTION = 'TransactionsActions_ADD_RECENT_TRANSACTION'
}

export interface FetchTransactionDataAction {
  type: TransactionsActions.FETCH_TRANSACTION_DATA;
  payload: string;
}

export interface SetTransactionDataAction {
  type: TransactionsActions.SET_TRANSACTION_DATA;
  payload: {
    txhash: string;
    data: TransactionData | null;
    receipt: TransactionReceipt | null;
    error: string | null;
  };
}

export interface ResetTransactionDataAction {
  type: TransactionsActions.RESET_TRANSACTION_DATA;
}

export interface AddRecentTransactionAction {
  type: TransactionsActions.ADD_RECENT_TRANSACTION;
  payload: SavedTransaction;
}

/*** Union Type ***/
export type TransactionsAction =
  | FetchTransactionDataAction
  | SetTransactionDataAction
  | ResetTransactionDataAction
  | AddRecentTransactionAction;
