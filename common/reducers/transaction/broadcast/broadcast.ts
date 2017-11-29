import { State, ITransactionStatus } from './typings';
import {
  TypeKeys as TK,
  BroadcastTransactionQueuedAction,
  BroadcastTransactionSucceededAction,
  BroadcastTransactionFailedAction
} from 'actions/transaction';
import { ReducersMapObject } from 'redux';
import { createReducerFromObj } from 'reducers/transaction/helpers';

const INITIAL_STATE = {};
const handleQueue = (
  state: State,
  { payload }: BroadcastTransactionQueuedAction
): State => {
  const { indexingHash, serializedTransaction } = payload;
  const nextTxStatus: ITransactionStatus = {
    broadcastedHash: null,
    broadcastSuccessful: false,
    isBroadcasting: true,
    serializedTransaction
  };
  return { ...state, [indexingHash]: nextTxStatus };
};

const handleSuccess = (
  state: State,
  { payload }: BroadcastTransactionSucceededAction
): State => {
  const { broadcastedHash, indexingHash } = payload;
  const existingTx = state[indexingHash];
  if (!existingTx) {
    throw Error(`Broadcasted transaction not found: ${indexingHash}`);
  }
  const nextTx: ITransactionStatus = {
    ...existingTx,
    broadcastedHash,
    isBroadcasting: false,
    broadcastSuccessful: true
  };
  return { ...state, [indexingHash]: nextTx };
};

const handleFailure = (
  state: State,
  { payload }: BroadcastTransactionFailedAction
): State => {
  const { indexingHash } = payload;
  const existingTx = state[indexingHash];
  if (!existingTx) {
    throw Error(`Broadcasted transaction not found: ${indexingHash}`);
  }
  const nextTx: ITransactionStatus = {
    ...existingTx,
    isBroadcasting: false,
    broadcastSuccessful: false
  };
  return { ...state, [indexingHash]: nextTx };
};

const reducerObj: ReducersMapObject = {
  [TK.BROADCAST_TRANSACTION_QUEUED]: handleQueue,
  [TK.BROADCAST_TRANSACTION_SUCCEEDED]: handleSuccess,
  [TK.BROADCAST_TRASACTION_FAILED]: handleFailure
};

export const broadcast = createReducerFromObj(reducerObj, INITIAL_STATE);
