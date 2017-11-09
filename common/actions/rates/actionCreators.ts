import * as interfaces from './actionTypes';
import { TypeKeys } from './constants';
import { fetchRates } from './actionPayloads';

export type TFetchCCRates = typeof fetchCCRates;
export function fetchCCRates(symbol: string): interfaces.FetchCCRates {
  return {
    type: TypeKeys.RATES_FETCH_CC,
    payload: fetchRates(symbol)
  };
}
