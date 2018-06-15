import { CCResponse } from 'api/rates';
import * as ratesTypes from './types';

export type TFetchCCRatesRequested = typeof fetchCCRatesRequested;
export function fetchCCRatesRequested(symbols: string[] = []): ratesTypes.FetchCCRatesRequested {
  return {
    type: ratesTypes.RatesActions.CC_REQUESTED,
    payload: symbols
  };
}

export type TFetchCCRatesSucceeded = typeof fetchCCRatesSucceeded;
export function fetchCCRatesSucceeded(payload: CCResponse): ratesTypes.FetchCCRatesSucceeded {
  return {
    type: ratesTypes.RatesActions.CC_SUCCEEDED,
    payload
  };
}

export type TFetchCCRatesFailed = typeof fetchCCRatesFailed;
export function fetchCCRatesFailed(): ratesTypes.FetchCCRatesFailed {
  return {
    type: ratesTypes.RatesActions.CC_FAILED
  };
}
