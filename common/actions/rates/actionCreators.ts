import * as interfaces from './actionTypes';
import { TypeKeys } from './constants';
import { fetchRates, CCResponse } from './actionPayloads';

export type TFetchCCRates = typeof fetchCCRates;
export function fetchCCRates(): interfaces.FetchCCRates {
  return {
    type: TypeKeys.RATES_FETCH_CC,
    payload: fetchRates()
  };
}
