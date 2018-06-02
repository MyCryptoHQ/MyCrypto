import { AppState } from 'features/reducers';

import { getTransactionState } from '../selectors';

export const getBroadcastState = (state: AppState) => getTransactionState(state).broadcast;
export const getTransactionStatus = (
  state: AppState,
  indexingHash: string //
) => getBroadcastState(state)[indexingHash];
