export interface FiatRequestedRatesAction {
  type: 'RATES_FIAT_REQUESTED';
}

export function fiatRequestedRates() {
  return {
    type: 'RATES_FIAT_REQUESTED'
  };
}

/*** Set rates ***/
export interface FiatSucceededRatesAction {
  type: 'RATES_FIAT_SUCCEEDED';
  payload: { [key: string]: number };
}

export function fiatSucceededRates(payload: {
  [key: string]: number;
}): FiatSucceededRatesAction {
  return {
    type: 'RATES_FIAT_SUCCEEDED',
    payload
  };
}

/*** Union Type ***/
export type RatesAction = FiatSucceededRatesAction | FiatRequestedRatesAction;
