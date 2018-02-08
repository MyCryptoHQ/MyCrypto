import { TypeKeys } from './constants';
import { CCResponse } from 'api/rates';

export interface FetchCCRatesRequested {
  type: TypeKeys.RATES_FETCH_CC_REQUESTED;
  payload: string[];
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
export type RatesAction = FetchCCRatesRequested | FetchCCRatesSucceeded | FetchCCRatesFailed;
