import { TypeKeys } from 'actions/transaction';
/* Broadcasting actions */
interface BroadcastLocalTransactionRequestedAction {
  type: TypeKeys.BROADCAST_LOCAL_TRANSACTION_REQUESTED;
}
interface BroadcastWeb3TransactionRequestedAction {
  type: TypeKeys.BROADCAST_WEB3_TRANSACTION_REQUESTED;
}
interface BroadcastTransactionSucceededAction {
  type: TypeKeys.BROADCAST_TRANSACTION_SUCCEEDED;
  payload: { indexingHash: string; broadcastedHash: string };
}
interface BroadcastTransactionQueuedAction {
  type: TypeKeys.BROADCAST_TRANSACTION_QUEUED;
  payload: { indexingHash: string; serializedTransaction: Buffer };
}
interface BroadcastTransactionFailedAction {
  type: TypeKeys.BROADCAST_TRASACTION_FAILED;
  payload: { indexingHash: string };
}
type BroadcastAction =
  | BroadcastLocalTransactionRequestedAction
  | BroadcastTransactionSucceededAction
  | BroadcastWeb3TransactionRequestedAction
  | BroadcastTransactionQueuedAction
  | BroadcastTransactionFailedAction;

export {
  BroadcastLocalTransactionRequestedAction,
  BroadcastTransactionSucceededAction,
  BroadcastWeb3TransactionRequestedAction,
  BroadcastTransactionQueuedAction,
  BroadcastTransactionFailedAction,
  BroadcastAction
};
