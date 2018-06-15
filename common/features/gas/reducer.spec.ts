import { GasEstimates } from 'api/gas';
import * as gasActions from './actions';
import * as gasReducer from './reducer';

describe('gas reducer', () => {
  it('should handle GAS_FETCH_ESTIMATES', () => {
    const state = gasReducer.gasReducer(undefined, gasActions.fetchGasEstimates());
    expect(state).toEqual({
      ...gasReducer.INITIAL_STATE,
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
    const state = gasReducer.gasReducer(undefined, gasActions.setGasEstimates(estimates));
    expect(state).toEqual({
      ...gasReducer.INITIAL_STATE,
      estimates,
      isEstimating: false
    });
  });
});
