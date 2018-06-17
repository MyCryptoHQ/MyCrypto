import * as types from './types';

export type TBroadcastLocalTransactionRequested = typeof broadcastLocalTransactionRequested;
export const broadcastLocalTransactionRequested = (): types.BroadcastLocalTransactionRequestedAction => ({
  type: types.TransactionBroadcastActions.LOCAL_TRANSACTION_REQUESTED
});

export type TBroadcastWeb3TransactionRequested = typeof broadcastWeb3TransactionRequested;
export const broadcastWeb3TransactionRequested = (): types.BroadcastWeb3TransactionRequestedAction => ({
  type: types.TransactionBroadcastActions.WEB3_TRANSACTION_REQUESTED
});

export type TBroadcastTransactionSucceeded = typeof broadcastTransactionSucceeded;
export const broadcastTransactionSucceeded = (
  payload: types.BroadcastTransactionSucceededAction['payload']
): types.BroadcastTransactionSucceededAction => ({
  type: types.TransactionBroadcastActions.TRANSACTION_SUCCEEDED,
  payload
});

export type TBroadcastTransactionFailed = typeof broadcastTransactionFailed;
export const broadcastTransactionFailed = (
  payload: types.BroadcastTransactionFailedAction['payload']
): types.BroadcastTransactionFailedAction => ({
  type: types.TransactionBroadcastActions.TRANSACTION_FAILED,
  payload
});

export type TBroadcastTransactionQueued = typeof broadcastTransactionQueued;
export const broadcastTransactionQueued = (
  payload: types.BroadcastTransactionQueuedAction['payload']
): types.BroadcastTransactionQueuedAction => ({
  type: types.TransactionBroadcastActions.TRANSACTION_QUEUED,
  payload
});
