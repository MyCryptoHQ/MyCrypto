export interface FiatRequestedRatesAction {
  type: 'RATES_FIAT_REQUESTED';
}

/*** Set rates ***/
export interface FiatSucceededRatesAction {
  type: 'RATES_FIAT_SUCCEEDED';
  payload: { [key: string]: number };
}

/*** Union Type ***/
export type RatesAction = FiatSucceededRatesAction | FiatRequestedRatesAction;
