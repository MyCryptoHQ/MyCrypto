import { AppState } from 'reducers';
import { getTransactionState } from 'selectors/transaction';
import { RequestStatus } from 'reducers/transaction/network';

export const getNetworkStatus = (state: AppState) => getTransactionState(state).network;

export const nonceRequestFailed = (state: AppState) =>
  getNetworkStatus(state).getNonceStatus === RequestStatus.FAILED;

export const isNetworkRequestPending = (state: AppState) => {
  const network = getNetworkStatus(state);
  const states: RequestStatus[] = Object.values(network);
  return states.reduce(
    (anyPending, currRequestState) => anyPending || currRequestState === RequestStatus.REQUESTED,
    false
  );
};

export const getGasEstimationPending = (state: AppState) =>
  getNetworkStatus(state).gasEstimationStatus === RequestStatus.REQUESTED;

export const getGasLimitEstimationTimedOut = (state: AppState) =>
  getNetworkStatus(state).gasEstimationStatus === RequestStatus.TIMEDOUT;
