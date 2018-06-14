import { RATES_FETCH, RatesState, FetchCCRatesSucceeded, RatesAction } from './types';

export const INITIAL_STATE: RatesState = {
  rates: {},
  ratesError: null
};

function fetchCCRatesSucceeded(state: RatesState, action: FetchCCRatesSucceeded): RatesState {
  return {
    ...state,
    rates: {
      ...state.rates,
      ...action.payload
    }
  };
}

function fetchCCRatesFailed(state: RatesState): RatesState {
  // TODO: Make library for error messages
  return {
    ...state,
    ratesError: 'Sorry. We were unable to fetch equivalent rates.'
  };
}

export function ratesReducer(state: RatesState = INITIAL_STATE, action: RatesAction): RatesState {
  switch (action.type) {
    case RATES_FETCH.CC_SUCCEEDED:
      return fetchCCRatesSucceeded(state, action);
    case RATES_FETCH.CC_FAILED:
      return fetchCCRatesFailed(state);
    default:
      return state;
  }
}
