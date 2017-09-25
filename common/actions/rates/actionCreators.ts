import * as interfaces from './actionTypes';
import { TypeKeys } from './constants';
import { fetchRates } from './actionPayloads';

export type TFetchCMCRates = typeof fetchCMCRates;
export function fetchCMCRates(): interfaces.FetchCMCRates {
  return {
    type: TypeKeys.RATES_FETCH_CMC,
    payload: fetchRates()
  };
}
