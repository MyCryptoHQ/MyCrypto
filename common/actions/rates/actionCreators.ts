import * as interfaces from './actionTypes';
import { TypeKeys } from './constants';
import { fetchRates, CCResponse } from './actionPayloads';

export type TFetchCCRates = typeof fetchCCRates;
export function fetchCCRates(symbols: string[] = []): interfaces.FetchCCRates {
  return {
    type: TypeKeys.RATES_FETCH_CC,
    payload: fetchRates(symbols)
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
