import { CCResponse } from 'api/rates';

export enum TypeKeys {
  RATES_FETCH_CC_REQUESTED = 'RATES_FETCH_CC_REQUESTED',
  RATES_FETCH_CC_FAILED = 'RATES_FETCH_CC_FAILED',
  RATES_FETCH_CC_SUCCEEDED = 'RATES_FETCH_CC_SUCCEEDED'
}

export interface FetchCCRatesRequested {
  type: TypeKeys.RATES_FETCH_CC_REQUESTED;
  payload: string[];
}

export interface FetchCCRatesSucceeded {
  type: TypeKeys.RATES_FETCH_CC_SUCCEEDED;
  payload: CCResponse;
}

export interface FetchCCRatesFailed {
  type: TypeKeys.RATES_FETCH_CC_FAILED;
}

export type RatesAction = FetchCCRatesRequested | FetchCCRatesSucceeded | FetchCCRatesFailed;
