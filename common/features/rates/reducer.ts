import * as ratesTypes from './types';

export const INITIAL_STATE: ratesTypes.RatesState = {
  rates: {},
  ratesError: null
};

function fetchCCRatesSucceeded(
  state: ratesTypes.RatesState,
  action: ratesTypes.FetchCCRatesSucceeded
): ratesTypes.RatesState {
  return {
    ...state,
    rates: {
      ...state.rates,
      ...action.payload
    }
  };
}

function fetchCCRatesFailed(state: ratesTypes.RatesState): ratesTypes.RatesState {
  // TODO: Make library for error messages
  return {
    ...state,
    ratesError: 'Sorry. We were unable to fetch equivalent rates.'
  };
}

export function ratesReducer(
  state: ratesTypes.RatesState = INITIAL_STATE,
  action: ratesTypes.RatesAction
): ratesTypes.RatesState {
  switch (action.type) {
    case ratesTypes.RatesActions.CC_SUCCEEDED:
      return fetchCCRatesSucceeded(state, action);
    case ratesTypes.RatesActions.CC_FAILED:
      return fetchCCRatesFailed(state);
    default:
      return state;
  }
}
