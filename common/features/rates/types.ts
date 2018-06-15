import { CCResponse } from 'api/rates';

export enum RatesActions {
  CC_REQUESTED = 'RATES_FETCH_CC_REQUESTED',
  CC_FAILED = 'RATES_FETCH_CC_FAILED',
  CC_SUCCEEDED = 'RATES_FETCH_CC_SUCCEEDED'
}

// SYMBOL -> PRICE TO BUY 1 ETH
export interface RatesState {
  rates: { [symbol: string]: CCResponse['rates'] };
  ratesError?: string | null;
}

export interface FetchCCRatesRequested {
  type: RatesActions.CC_REQUESTED;
  payload: string[];
}

export interface FetchCCRatesSucceeded {
  type: RatesActions.CC_SUCCEEDED;
  payload: CCResponse;
}

export interface FetchCCRatesFailed {
  type: RatesActions.CC_FAILED;
}

export type RatesAction = FetchCCRatesRequested | FetchCCRatesSucceeded | FetchCCRatesFailed;
