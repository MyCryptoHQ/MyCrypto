import { AppState } from 'reducers';
import { getTransactionState } from 'selectors/transaction';
import { RequestStatus } from 'reducers/transaction/network';
import { getSetGasLimit } from 'selectors/config';

export const getNetworkStatus = (state: AppState) => getTransactionState(state).network;

export const nonceRequestFailed = (state: AppState) =>
  getNetworkStatus(state).getNonceStatus === RequestStatus.FAILED;

export const isNetworkRequestPending = (state: AppState) => {
  const network = getNetworkStatus(state);
  const setGasLimit = getSetGasLimit(state);

  // Don't check the status of gasEstimation if we're not automatically setting gas limit
  const exclude = ['gasEstimationStatus'];
  const filteredNetwork = Object.keys(network)
    .filter(key => !exclude.includes(key))
    .reduce((obj, key) => {
      obj[key] = network[key];
      return obj;
    }, {});

  const states: RequestStatus[] = Object.values(setGasLimit ? network : filteredNetwork);
  return states.reduce(
    (anyPending, currRequestState) => anyPending || currRequestState === RequestStatus.REQUESTED,
    false
  );
};
