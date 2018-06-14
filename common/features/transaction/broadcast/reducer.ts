import {
  TRANSACTION_BROADCAST,
  ITransactionStatus,
  BroadcastTransactionQueuedAction,
  BroadcastTransactionSucceededAction,
  BroadcastTransactionFailedAction,
  BroadcastAction
} from './types';

export interface BroadcastState {
  [indexingHash: string]: ITransactionStatus | null;
}

export const BROADCAST_INITIAL_STATE = {};
const handleQueue = (
  state: BroadcastState,
  { payload }: BroadcastTransactionQueuedAction
): BroadcastState => {
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
  state: BroadcastState,
  { payload }: BroadcastTransactionSucceededAction
): BroadcastState => {
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
  state: BroadcastState,
  { payload }: BroadcastTransactionFailedAction
): BroadcastState => {
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

export function broadcastReducer(
  state: BroadcastState = BROADCAST_INITIAL_STATE,
  action: BroadcastAction
) {
  switch (action.type) {
    case TRANSACTION_BROADCAST.TRANSACTION_QUEUED:
      return handleQueue(state, action);
    case TRANSACTION_BROADCAST.TRANSACTION_SUCCEEDED:
      return handleSuccess(state, action);
    case TRANSACTION_BROADCAST.TRANSACTION_FAILED:
      return handleFailure(state, action);
    default:
      return state;
  }
}
