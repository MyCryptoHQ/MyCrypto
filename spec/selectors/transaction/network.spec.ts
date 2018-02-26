import {
  getNetworkStatus,
  nonceRequestPending,
  nonceRequestFailed,
  isNetworkRequestPending,
  getGasEstimationPending,
  getGasLimitEstimationTimedOut
} from 'selectors/transaction';
import TEST_STATE from './TestState.json';

describe('current selector', () => {
  it('should get network status', () => {
    expect(getNetworkStatus(TEST_STATE)).toEqual(TEST_STATE.transaction.network);
  });

  it('should check with the store if the nonce request is pending', () => {
    expect(nonceRequestPending(TEST_STATE)).toEqual(false);
  });

  it('should check with the store if the nonce request failed', () => {
    expect(nonceRequestFailed(TEST_STATE)).toEqual(false);
  });

  it('should check with the store if the gas estimation is pending', () => {
    expect(getGasEstimationPending(TEST_STATE)).toEqual(false);
  });

  it('should check with the store if gas limit estimation timed out', () => {
    expect(getGasLimitEstimationTimedOut(TEST_STATE)).toEqual(false);
  });

  it('should check with the store if network request is pending', () => {
    expect(isNetworkRequestPending(TEST_STATE)).toEqual(false);
  });
});
