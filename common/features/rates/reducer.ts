import * as types from './types';

export const INITIAL_STATE: types.RatesState = {
  rates: {},
  ratesError: null
};

function fetchCCRatesSucceeded(
  state: types.RatesState,
  action: types.FetchCCRatesSucceeded
): types.RatesState {
  return {
    ...state,
    rates: {
      ...state.rates,
      ...action.payload
    }
  };
}

function fetchCCRatesFailed(state: types.RatesState): types.RatesState {
  // TODO: Make library for error messages
  return {
    ...state,
    ratesError: 'Sorry. We were unable to fetch equivalent rates.'
  };
}

export function ratesReducer(
  state: types.RatesState = INITIAL_STATE,
  action: types.RatesAction
): types.RatesState {
  switch (action.type) {
    case types.RatesActions.CC_SUCCEEDED:
      return fetchCCRatesSucceeded(state, action);
    case types.RatesActions.CC_FAILED:
      return fetchCCRatesFailed(state);
    default:
      return state;
  }
}
