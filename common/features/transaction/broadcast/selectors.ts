import { AppState } from 'features/reducers';

const getTransactionState = (state: AppState) => state.transaction;

export const getBroadcastState = (state: AppState) => getTransactionState(state).broadcast;
export const getTransactionStatus = (
  state: AppState,
  indexingHash: string //
) => getBroadcastState(state)[indexingHash];
