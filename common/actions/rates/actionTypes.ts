import { TypeKeys } from './constants';

export interface FetchCMCRates {
  type: TypeKeys.RATES_FETCH_CMC;
  payload: Promise<any>;
}

/*** Set rates ***/
export interface FetchCMCRatesSucceeded {
  type: TypeKeys.RATES_FETCH_CMC_SUCCEEDED;
  payload: { [key: string]: number };
}

export interface FetchCMCRatesFailed {
  type: TypeKeys.RATES_FETCH_CMC_FAILED;
}

/*** Union Type ***/
export type RatesAction =
  | FetchCMCRatesSucceeded
  | FetchCMCRates
  | FetchCMCRatesFailed;
