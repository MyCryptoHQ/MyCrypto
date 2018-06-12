import { TRANSACTION } from '../types';

export interface BroadcastLocalTransactionRequestedAction {
  type: TRANSACTION.BROADCAST_LOCAL_TRANSACTION_REQUESTED;
}
export interface BroadcastWeb3TransactionRequestedAction {
  type: TRANSACTION.BROADCAST_WEB3_TRANSACTION_REQUESTED;
}
export interface BroadcastTransactionSucceededAction {
  type: TRANSACTION.BROADCAST_TRANSACTION_SUCCEEDED;
  payload: { indexingHash: string; broadcastedHash: string };
}
export interface BroadcastTransactionQueuedAction {
  type: TRANSACTION.BROADCAST_TRANSACTION_QUEUED;
  payload: { indexingHash: string; serializedTransaction: Buffer };
}
export interface BroadcastTransactionFailedAction {
  type: TRANSACTION.BROADCAST_TRASACTION_FAILED;
  payload: { indexingHash: string };
}
export type BroadcastAction =
  | BroadcastLocalTransactionRequestedAction
  | BroadcastTransactionSucceededAction
  | BroadcastWeb3TransactionRequestedAction
  | BroadcastTransactionQueuedAction
  | BroadcastTransactionFailedAction;

export interface ITransactionStatus {
  serializedTransaction: Buffer;
  broadcastedHash: string | null;
  isBroadcasting: boolean;
  broadcastSuccessful: boolean;
}

export type BroadcastRequestedAction =
  | BroadcastWeb3TransactionRequestedAction
  | BroadcastLocalTransactionRequestedAction;

export interface ISerializedTxAndIndexingHash {
  serializedTransaction: Buffer;
  indexingHash: string;
}
