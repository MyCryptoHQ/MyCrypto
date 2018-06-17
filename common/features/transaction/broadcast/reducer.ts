import * as types from './types';

export const BROADCAST_INITIAL_STATE = {};
const handleQueue = (
  state: types.TransactionBroadcastState,
  { payload }: types.BroadcastTransactionQueuedAction
): types.TransactionBroadcastState => {
  const { indexingHash, serializedTransaction } = payload;
  const nextTxStatus: types.ITransactionStatus = {
    broadcastedHash: null,
    broadcastSuccessful: false,
    isBroadcasting: true,
    serializedTransaction
  };
  return { ...state, [indexingHash]: nextTxStatus };
};

const handleSuccess = (
  state: types.TransactionBroadcastState,
  { payload }: types.BroadcastTransactionSucceededAction
): types.TransactionBroadcastState => {
  const { broadcastedHash, indexingHash } = payload;
  const existingTx = state[indexingHash];
  if (!existingTx) {
    throw Error(`Broadcasted transaction not found: ${indexingHash}`);
  }
  const nextTx: types.ITransactionStatus = {
    ...existingTx,
    broadcastedHash,
    isBroadcasting: false,
    broadcastSuccessful: true
  };
  return { ...state, [indexingHash]: nextTx };
};

const handleFailure = (
  state: types.TransactionBroadcastState,
  { payload }: types.BroadcastTransactionFailedAction
): types.TransactionBroadcastState => {
  const { indexingHash } = payload;
  const existingTx = state[indexingHash];
  if (!existingTx) {
    throw Error(`Broadcasted transaction not found: ${indexingHash}`);
  }
  const nextTx: types.ITransactionStatus = {
    ...existingTx,
    isBroadcasting: false,
    broadcastSuccessful: false
  };
  return { ...state, [indexingHash]: nextTx };
};

export function broadcastReducer(
  state: types.TransactionBroadcastState = BROADCAST_INITIAL_STATE,
  action: types.TransactionBroadcastAction
) {
  switch (action.type) {
    case types.TransactionBroadcastActions.TRANSACTION_QUEUED:
      return handleQueue(state, action);
    case types.TransactionBroadcastActions.TRANSACTION_SUCCEEDED:
      return handleSuccess(state, action);
    case types.TransactionBroadcastActions.TRANSACTION_FAILED:
      return handleFailure(state, action);
    default:
      return state;
  }
}
