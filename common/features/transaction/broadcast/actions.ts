import {
  TRANSACTION_BROADCAST,
  BroadcastLocalTransactionRequestedAction,
  BroadcastWeb3TransactionRequestedAction,
  BroadcastTransactionFailedAction,
  BroadcastTransactionSucceededAction,
  BroadcastTransactionQueuedAction
} from './types';

export type TBroadcastLocalTransactionRequested = typeof broadcastLocalTransactionRequested;
export const broadcastLocalTransactionRequested = (): BroadcastLocalTransactionRequestedAction => ({
  type: TRANSACTION_BROADCAST.LOCAL_TRANSACTION_REQUESTED
});

export type TBroadcastWeb3TransactionRequested = typeof broadcastWeb3TransactionRequested;
export const broadcastWeb3TransactionRequested = (): BroadcastWeb3TransactionRequestedAction => ({
  type: TRANSACTION_BROADCAST.WEB3_TRANSACTION_REQUESTED
});

export type TBroadcastTransactionSucceeded = typeof broadcastTransactionSucceeded;
export const broadcastTransactionSucceeded = (
  payload: BroadcastTransactionSucceededAction['payload']
): BroadcastTransactionSucceededAction => ({
  type: TRANSACTION_BROADCAST.TRANSACTION_SUCCEEDED,
  payload
});

export type TBroadcastTransactionFailed = typeof broadcastTransactionFailed;
export const broadcastTransactionFailed = (
  payload: BroadcastTransactionFailedAction['payload']
): BroadcastTransactionFailedAction => ({
  type: TRANSACTION_BROADCAST.TRANSACTION_FAILED,
  payload
});

export type TBroadcastTransactionQueued = typeof broadcastTransactionQueued;
export const broadcastTransactionQueued = (
  payload: BroadcastTransactionQueuedAction['payload']
): BroadcastTransactionQueuedAction => ({
  type: TRANSACTION_BROADCAST.TRANSACTION_QUEUED,
  payload
});
