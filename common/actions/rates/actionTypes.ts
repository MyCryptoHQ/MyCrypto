import { TypeKeys } from './constants';
export interface FiatRequestedRatesAction {
  type: TypeKeys.RATES_FIAT_REQUESTED;
}

/*** Set rates ***/
export interface FiatSucceededRatesAction {
  type: TypeKeys.RATES_FIAT_SUCCEEDED;
  payload: { [key: string]: number };
}

/*** Union Type ***/
export type RatesAction = FiatSucceededRatesAction | FiatRequestedRatesAction;
