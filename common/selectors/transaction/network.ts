import { AppState } from 'reducers';
import { getTransactionState } from 'selectors/transaction';
export { nonceRequestFailed };
const getNetworkStatus = (state: AppState) => getTransactionState(state).network;
const nonceRequestFailed = (state: AppState) => getNetworkStatus(state).getNonceFailed;
