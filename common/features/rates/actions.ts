import { CCResponse } from 'api/rates';
import {
  TypeKeys,
  FetchCCRatesRequested,
  FetchCCRatesSucceeded,
  FetchCCRatesFailed
} from './types';

export type TFetchCCRatesRequested = typeof fetchCCRatesRequested;
export function fetchCCRatesRequested(symbols: string[] = []): FetchCCRatesRequested {
  return {
    type: TypeKeys.RATES_FETCH_CC_REQUESTED,
    payload: symbols
  };
}

export type TFetchCCRatesSucceeded = typeof fetchCCRatesSucceeded;
export function fetchCCRatesSucceeded(payload: CCResponse): FetchCCRatesSucceeded {
  return {
    type: TypeKeys.RATES_FETCH_CC_SUCCEEDED,
    payload
  };
}

export type TFetchCCRatesFailed = typeof fetchCCRatesFailed;
export function fetchCCRatesFailed(): FetchCCRatesFailed {
  return {
    type: TypeKeys.RATES_FETCH_CC_FAILED
  };
}
