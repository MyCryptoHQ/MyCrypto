import { gas, INITIAL_STATE } from 'reducers/gas';
import { fetchGasEstimates, setGasEstimates } from 'actions/gas';
import { GasEstimates } from 'api/gas';

describe('gas reducer', () => {
  it('should handle GAS_FETCH_ESTIMATES', () => {
    const state = gas(undefined, fetchGasEstimates());
    expect(state).toEqual({
      ...INITIAL_STATE,
      isEstimating: true
    });
  });

  it('should handle GAS_SET_ESTIMATES', () => {
    const estimates: GasEstimates = {
      safeLow: 1,
      standard: 1,
      fast: 4,
      fastest: 20,
      time: Date.now(),
      chainId: 1,
      isDefault: false
    };
    const state = gas(undefined, setGasEstimates(estimates));
    expect(state).toEqual({
      ...INITIAL_STATE,
      estimates,
      isEstimating: false
    });
  });
});
