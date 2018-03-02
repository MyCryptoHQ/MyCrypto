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
    gasEstimationStatus: 'PENDING',
    getFromStatus: 'SUCCESS',
    getNonceStatus: 'PENDING',
    gasPriceStatus: 'SUCCESS'
  };

  it('should get network status', () => {
    expect(getNetworkStatus(state)).toEqual(state.transaction.network);
  });

  it('should check with the store if the nonce request is pending', () => {
    expect(nonceRequestPending(state)).toEqual(true);
  });

  it('should check with the store if the nonce request failed', () => {
    state.transaction.network.getNonceStatus = 'FAIL';
    expect(nonceRequestFailed(state)).toEqual(true);
  });

  it('should check with the store if the gas estimation is pending', () => {
    expect(getGasEstimationPending(state)).toEqual(true);
  });

  it('should check with the store if gas limit estimation timed out', () => {
    state.transaction.network.gasEstimationStatus = 'TIMEDOUT';
    expect(getGasLimitEstimationTimedOut(state)).toEqual(true);
  });

  it('should check with the store if network request is pending', () => {
    state.transaction.network.gasEstimationStatus = 'PENDING';
    expect(isNetworkRequestPending(state)).toEqual(true);
  });
});
