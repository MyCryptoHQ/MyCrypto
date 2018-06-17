import { AppState } from 'features/reducers';
import { transactionNetworkTypes } from '../network';

const getTransactionState = (state: AppState) => state.transaction;

export const getNetworkStatus = (state: AppState) => getTransactionState(state).network;

export const nonceRequestPending = (state: AppState) =>
  getNetworkStatus(state).getNonceStatus === transactionNetworkTypes.RequestStatus.REQUESTED;

export const nonceRequestFailed = (state: AppState) =>
  getNetworkStatus(state).getNonceStatus === transactionNetworkTypes.RequestStatus.FAILED;

export const isNetworkRequestPending = (state: AppState) => {
  const network = getNetworkStatus(state);
  const states: transactionNetworkTypes.RequestStatus[] = Object.values(network);
  return states.reduce(
    (anyPending, currRequestState) =>
      anyPending || currRequestState === transactionNetworkTypes.RequestStatus.REQUESTED,
    false
  );
};

export const getGasEstimationPending = (state: AppState) =>
  getNetworkStatus(state).gasEstimationStatus === transactionNetworkTypes.RequestStatus.REQUESTED;

export const getGasLimitEstimationTimedOut = (state: AppState) =>
  getNetworkStatus(state).gasEstimationStatus === transactionNetworkTypes.RequestStatus.TIMEDOUT;
