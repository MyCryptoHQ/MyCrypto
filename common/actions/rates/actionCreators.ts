import * as interfaces from './actionTypes';
import { TypeKeys } from './constants';
import { fetchRates } from './actionPayloads';

export type TFetchCCRates = typeof fetchCCRates;
export function fetchCCRates(symbols: string[] = []): interfaces.FetchCCRates {
  return {
    type: TypeKeys.RATES_FETCH_CC,
    payload: fetchRates(symbols)
  };
}
