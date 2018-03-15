import { RequestStatus } from 'reducers/transaction/network';
import {
  getNetworkStatus,
  nonceRequestPending,
  nonceRequestFailed,
  isNetworkRequestPending,
  getGasEstimationPending,
  getGasLimitEstimationTimedOut
} from 'selectors/transaction';
import { getInitialState } from '../helpers';

describe('current selector', () => {
  const state = getInitialState();
  state.transaction.network = {
    ...state.transaction.network,
    gasEstimationStatus: RequestStatus.REQUESTED,
    getFromStatus: RequestStatus.SUCCEEDED,
    getNonceStatus: RequestStatus.REQUESTED,
    gasPriceStatus: RequestStatus.SUCCEEDED
  };

  it('should get network status', () => {
    expect(getNetworkStatus(state)).toEqual(state.transaction.network);
  });

  it('should check with the store if the nonce request is pending', () => {
    expect(nonceRequestPending(state)).toEqual(true);
  });

  it('should check with the store if the nonce request failed', () => {
    state.transaction.network.getNonceStatus = RequestStatus.FAILED;
    expect(nonceRequestFailed(state)).toEqual(true);
  });

  it('should check with the store if the gas estimation is pending', () => {
    expect(getGasEstimationPending(state)).toEqual(true);
  });

  it('should check with the store if gas limit estimation timed out', () => {
    state.transaction.network.gasEstimationStatus = RequestStatus.TIMEDOUT;
    expect(getGasLimitEstimationTimedOut(state)).toEqual(true);
  });

  it('should check with the store if network request is pending', () => {
    state.transaction.network.gasEstimationStatus = RequestStatus.REQUESTED;
    expect(isNetworkRequestPending(state)).toEqual(true);
  });
});
