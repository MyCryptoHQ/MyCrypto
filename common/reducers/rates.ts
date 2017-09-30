import {
  FetchCCRatesSucceeded,
  FetchCCRatesFailed,
  RatesAction,
  CCResponse
} from 'actions/rates';
import { TypeKeys } from 'actions/rates/constants';
import { Optional } from 'utils/types';

// SYMBOL -> PRICE TO BUY 1 ETH
export interface State {
  rates?: Optional<CCResponse>;
  ratesError?: string | null;
}

export const INITIAL_STATE: State = {};

function fetchCCRatesSucceeded(
  state: State,
  action: FetchCCRatesSucceeded
): State {
  return { ...state, rates: action.payload };
}

function fetchCCRatesFailed(state: State, action: FetchCCRatesFailed): State {
  // TODO: Make library for error messages
  return {
    ...state,
    ratesError: 'Sorry. We were unable to fetch equivalent rates.'
  };
}

export function rates(
  state: State = INITIAL_STATE,
  action: RatesAction
): State {
  switch (action.type) {
    case TypeKeys.RATES_FETCH_CC_SUCCEEDED:
      return fetchCCRatesSucceeded(state, action);
    case TypeKeys.RATES_FETCH_CC_FAILED:
      return fetchCCRatesFailed(state, action);
    default:
      return state;
  }
}
