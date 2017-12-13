import { TypeKeys } from './constants';
import { CCResponse } from './actionPayloads';

export interface FetchCCRates {
  type: TypeKeys.RATES_FETCH_CC;
  payload: Promise<CCResponse>;
}

/*** Set rates ***/
export interface FetchCCRatesSucceeded {
  type: TypeKeys.RATES_FETCH_CC_SUCCEEDED;
  payload: CCResponse;
}

export interface FetchCCRatesFailed {
  type: TypeKeys.RATES_FETCH_CC_FAILED;
}

/*** Union Type ***/
export type RatesAction = FetchCCRates | FetchCCRatesSucceeded | FetchCCRatesFailed;
