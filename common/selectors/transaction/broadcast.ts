import { AppState } from 'reducers';
import { getTransactionState } from './transaction';
import { getSignState } from './sign';
export {
  getTransactionStatus,
  currentTransactionBroadcasting,
  currentTransactionBroadcasted,
  getCurrentTransactionStatus
};

const getBroadcastState = (state: AppState) => getTransactionState(state).broadcast;
const getTransactionStatus = (state: AppState, indexingHash: string) =>
  getBroadcastState(state)[indexingHash];

// Note: if the transaction or the indexing hash doesn't exist, we have a problem
const currentTransactionBroadcasting = (state: AppState) => {
  const txExists = getCurrentTransactionStatus(state);

  return txExists && txExists.isBroadcasting;
};

const currentTransactionBroadcasted = (state: AppState) => {
  const txExists = getCurrentTransactionStatus(state);

  return txExists && !txExists.isBroadcasting;
};

const getCurrentTransactionStatus = (state: AppState) => {
  const { indexingHash } = getSignState(state);
  if (!indexingHash) {
    return false;
  }
  const txExists = getTransactionStatus(state, indexingHash);
  return txExists;
};
