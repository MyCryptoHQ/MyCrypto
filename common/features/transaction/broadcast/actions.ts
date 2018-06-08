import { TypeKeys } from '../types';
import {
  BroadcastLocalTransactionRequestedAction,
  BroadcastWeb3TransactionRequestedAction,
  BroadcastTransactionFailedAction,
  BroadcastTransactionSucceededAction,
  BroadcastTransactionQueuedAction
} from './types';

export type TBroadcastLocalTransactionRequested = typeof broadcastLocalTransactionRequested;
export const broadcastLocalTransactionRequested = (): BroadcastLocalTransactionRequestedAction => ({
  type: TypeKeys.BROADCAST_LOCAL_TRANSACTION_REQUESTED
});

export type TBroadcastWeb3TransactionRequested = typeof broadcastWeb3TransactionRequested;
export const broadcastWeb3TransactionRequested = (): BroadcastWeb3TransactionRequestedAction => ({
  type: TypeKeys.BROADCAST_WEB3_TRANSACTION_REQUESTED
});

export type TBroadcastTransactionSucceeded = typeof broadcastTransactionSucceeded;
export const broadcastTransactionSucceeded = (
  payload: BroadcastTransactionSucceededAction['payload']
): BroadcastTransactionSucceededAction => ({
  type: TypeKeys.BROADCAST_TRANSACTION_SUCCEEDED,
  payload
});

export type TBroadcastTransactionFailed = typeof broadcastTransactionFailed;
export const broadcastTransactionFailed = (
  payload: BroadcastTransactionFailedAction['payload']
): BroadcastTransactionFailedAction => ({
  type: TypeKeys.BROADCAST_TRASACTION_FAILED,
  payload
});

export type TBroadcastTransactionQueued = typeof broadcastTransactionQueued;
export const broadcastTransactionQueued = (
  payload: BroadcastTransactionQueuedAction['payload']
): BroadcastTransactionQueuedAction => ({
  type: TypeKeys.BROADCAST_TRANSACTION_QUEUED,
  payload
});
