import * as interfaces from './actionTypes';
import { TypeKeys } from './constants';
import { CCResponse } from 'api/rates';

export type TFetchCCRatesRequested = typeof fetchCCRatesRequested;
export function fetchCCRatesRequested(symbols: string[] = []): interfaces.FetchCCRatesRequested {
  return {
    type: TypeKeys.RATES_FETCH_CC_REQUESTED,
    payload: symbols
  };
}

export type TFetchCCRatesSucceeded = typeof fetchCCRatesSucceeded;
export function fetchCCRatesSucceeded(payload: CCResponse): interfaces.FetchCCRatesSucceeded {
  return {
    type: TypeKeys.RATES_FETCH_CC_SUCCEEDED,
    payload
  };
}

export type TFetchCCRatesFailed = typeof fetchCCRatesFailed;
export function fetchCCRatesFailed(): interfaces.FetchCCRatesFailed {
  return {
    type: TypeKeys.RATES_FETCH_CC_FAILED
  };
}
