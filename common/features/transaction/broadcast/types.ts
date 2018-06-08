import { TypeKeys } from '../types';

export interface BroadcastLocalTransactionRequestedAction {
  type: TypeKeys.BROADCAST_LOCAL_TRANSACTION_REQUESTED;
}
export interface BroadcastWeb3TransactionRequestedAction {
  type: TypeKeys.BROADCAST_WEB3_TRANSACTION_REQUESTED;
}
export interface BroadcastTransactionSucceededAction {
  type: TypeKeys.BROADCAST_TRANSACTION_SUCCEEDED;
  payload: { indexingHash: string; broadcastedHash: string };
}
export interface BroadcastTransactionQueuedAction {
  type: TypeKeys.BROADCAST_TRANSACTION_QUEUED;
  payload: { indexingHash: string; serializedTransaction: Buffer };
}
export interface BroadcastTransactionFailedAction {
  type: TypeKeys.BROADCAST_TRASACTION_FAILED;
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
