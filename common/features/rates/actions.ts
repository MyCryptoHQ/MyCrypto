import { CCResponse } from 'api/rates';
import {
  RATES_FETCH,
  FetchCCRatesRequested,
  FetchCCRatesSucceeded,
  FetchCCRatesFailed
} from './types';

export type TFetchCCRatesRequested = typeof fetchCCRatesRequested;
export function fetchCCRatesRequested(symbols: string[] = []): FetchCCRatesRequested {
  return {
    type: RATES_FETCH.CC_REQUESTED,
    payload: symbols
  };
}

export type TFetchCCRatesSucceeded = typeof fetchCCRatesSucceeded;
export function fetchCCRatesSucceeded(payload: CCResponse): FetchCCRatesSucceeded {
  return {
    type: RATES_FETCH.CC_SUCCEEDED,
    payload
  };
}

export type TFetchCCRatesFailed = typeof fetchCCRatesFailed;
export function fetchCCRatesFailed(): FetchCCRatesFailed {
  return {
    type: RATES_FETCH.CC_FAILED
  };
}
