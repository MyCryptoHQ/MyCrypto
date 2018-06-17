import { GasEstimates } from 'api/gas';
import * as actions from './actions';
import * as reducer from './reducer';

describe('gas reducer', () => {
  it('should handle GAS_FETCH_ESTIMATES', () => {
    const state = reducer.gasReducer(undefined, actions.fetchGasEstimates());
    expect(state).toEqual({
      ...reducer.INITIAL_STATE,
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
    const state = reducer.gasReducer(undefined, actions.setGasEstimates(estimates));
    expect(state).toEqual({
      ...reducer.INITIAL_STATE,
      estimates,
      isEstimating: false
    });
  });
});
