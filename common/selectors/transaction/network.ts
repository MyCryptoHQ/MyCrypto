import { AppState } from 'reducers';
import { getTransactionState } from 'selectors/transaction';
import { RequestStatus } from 'reducers/transaction/network';
import { getAutoGasLimitEnabled } from 'selectors/config';

export const getNetworkStatus = (state: AppState) => getTransactionState(state).network;

export const nonceRequestFailed = (state: AppState) =>
  getNetworkStatus(state).getNonceStatus === RequestStatus.FAILED;

export const isNetworkRequestPending = (state: AppState) => {
  const network = getNetworkStatus(state);
  const autoGasLimitEnabled = getAutoGasLimitEnabled(state);

  // Don't check the status of gasEstimation if we're not automatically setting gas limit
  const filteredNetwork = Object.keys(network).reduce((obj, key) => {
    obj[key] = network[key];
    return obj;
  }, {});

  const states: RequestStatus[] = Object.values(autoGasLimitEnabled ? network : filteredNetwork);
  return states.reduce(
    (anyPending, currRequestState) => anyPending || currRequestState === RequestStatus.REQUESTED,
    false
  );
};

export const getGasEstimationPending = (state: AppState) =>
  getNetworkStatus(state).gasEstimationStatus === RequestStatus.REQUESTED;

export const getGasLimitEstimationTimedOut = (state: AppState) =>
  getNetworkStatus(state).gasEstimationStatus === RequestStatus.TIMEDOUT;
