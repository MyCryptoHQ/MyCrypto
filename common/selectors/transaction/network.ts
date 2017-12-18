import { AppState } from 'reducers';
import { getTransactionState } from 'selectors/transaction';
import { RequestStatus } from 'reducers/transaction/network';

const getNetworkStatus = (state: AppState) => getTransactionState(state).network;
const nonceRequestFailed = (state: AppState) =>
  getNetworkStatus(state).getNonceStatus === RequestStatus.FAILED;
const isNetworkRequestPending = (state: AppState) => {
  const network = getNetworkStatus(state);
  const states: RequestStatus[] = Object.values(network);
  return states.reduce(
    (anyPending, currRequestState) => anyPending || currRequestState === RequestStatus.REQUESTED,
    false
  );
};

export { nonceRequestFailed, isNetworkRequestPending };
