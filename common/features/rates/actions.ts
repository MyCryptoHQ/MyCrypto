import { CCResponse } from 'api/rates';
import * as types from './types';

export type TFetchCCRatesRequested = typeof fetchCCRatesRequested;
export function fetchCCRatesRequested(symbols: string[] = []): types.FetchCCRatesRequested {
  return {
    type: types.RatesActions.CC_REQUESTED,
    payload: symbols
  };
}

export type TFetchCCRatesSucceeded = typeof fetchCCRatesSucceeded;
export function fetchCCRatesSucceeded(payload: CCResponse): types.FetchCCRatesSucceeded {
  return {
    type: types.RatesActions.CC_SUCCEEDED,
    payload
  };
}

export type TFetchCCRatesFailed = typeof fetchCCRatesFailed;
export function fetchCCRatesFailed(): types.FetchCCRatesFailed {
  return {
    type: types.RatesActions.CC_FAILED
  };
}
