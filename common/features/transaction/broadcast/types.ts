export enum TRANSACTION_BROADCAST {
  WEB3_TRANSACTION_REQUESTED = 'BROADCAST_WEB3_TRANSACTION_REQUESTED',
  TRANSACTION_SUCCEEDED = 'BROADCAST_TRANSACTION_SUCCEEDED',
  LOCAL_TRANSACTION_REQUESTED = 'BROADCAST_LOCAL_TRANSACTION_REQUESTED',
  TRANSACTION_QUEUED = 'BROADCAST_TRANSACTION_QUEUED',
  TRANSACTION_FAILED = 'BROADCAST_TRANSACTION_FAILED'
}

export interface BroadcastLocalTransactionRequestedAction {
  type: TRANSACTION_BROADCAST.LOCAL_TRANSACTION_REQUESTED;
}
export interface BroadcastWeb3TransactionRequestedAction {
  type: TRANSACTION_BROADCAST.WEB3_TRANSACTION_REQUESTED;
}
export interface BroadcastTransactionSucceededAction {
  type: TRANSACTION_BROADCAST.TRANSACTION_SUCCEEDED;
  payload: { indexingHash: string; broadcastedHash: string };
}
export interface BroadcastTransactionQueuedAction {
  type: TRANSACTION_BROADCAST.TRANSACTION_QUEUED;
  payload: { indexingHash: string; serializedTransaction: Buffer };
}
export interface BroadcastTransactionFailedAction {
  type: TRANSACTION_BROADCAST.TRANSACTION_FAILED;
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
