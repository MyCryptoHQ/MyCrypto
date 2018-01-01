import {
  BroadcastLocalTransactionRequestedAction,
  BroadcastWeb3TransactionRequestedAction,
  BroadcastTransactionFailedAction,
  BroadcastTransactionSucceededAction,
  BroadcastTransactionQueuedAction
} from '../actionTypes';
import { TypeKeys } from '../constants';

type TBroadcastLocalTransactionRequested = typeof broadcastLocalTransactionRequested;
const broadcastLocalTransactionRequested = (): BroadcastLocalTransactionRequestedAction => ({
  type: TypeKeys.BROADCAST_LOCAL_TRANSACTION_REQUESTED
});

type TBroadcastWeb3TransactionRequested = typeof broadcastWeb3TransactionRequested;
const broadcastWeb3TransactionRequested = (): BroadcastWeb3TransactionRequestedAction => ({
  type: TypeKeys.BROADCAST_WEB3_TRANSACTION_REQUESTED
});

type TBroadcastTransactionSucceeded = typeof broadcastTransactionSucceeded;
const broadcastTransactionSucceeded = (
  payload: BroadcastTransactionSucceededAction['payload']
): BroadcastTransactionSucceededAction => ({
  type: TypeKeys.BROADCAST_TRANSACTION_SUCCEEDED,
  payload
});

type TBroadcastTransactionFailed = typeof broadcastTransactionFailed;
const broadcastTransactionFailed = (
  payload: BroadcastTransactionFailedAction['payload']
): BroadcastTransactionFailedAction => ({
  type: TypeKeys.BROADCAST_TRASACTION_FAILED,
  payload
});

type TBroadcastTransactionQueued = typeof broadcastTransactionQueued;
const broadcastTransactionQueued = (
  payload: BroadcastTransactionQueuedAction['payload']
): BroadcastTransactionQueuedAction => ({
  type: TypeKeys.BROADCAST_TRANSACTION_QUEUED,
  payload
});

export {
  broadcastLocalTransactionRequested,
  broadcastWeb3TransactionRequested,
  broadcastTransactionSucceeded,
  broadcastTransactionFailed,
  broadcastTransactionQueued,
  TBroadcastLocalTransactionRequested,
  TBroadcastWeb3TransactionRequested,
  TBroadcastTransactionSucceeded,
  TBroadcastTransactionFailed,
  TBroadcastTransactionQueued
};
