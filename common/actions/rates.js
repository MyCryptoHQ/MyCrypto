// @flow

export type FiatRequestedRatesAction = {
  type: 'RATES_FIAT_REQUESTED'
};

export function fiatRequestedRates() {
  return {
    type: 'RATES_FIAT_REQUESTED'
  };
}

/*** Set rates ***/
export type FiatSucceededRatesAction = {
  type: 'RATES_FIAT_SUCCEEDED',
  payload: { [string]: number }
};

export function fiatSucceededRates(payload: {
  [string]: number
}): FiatSucceededRatesAction {
  return {
    type: 'RATES_FIAT_SUCCEEDED',
    payload
  };
}

/*** Union Type ***/
export type RatesAction = FiatSucceededRatesAction | FiatRequestedRatesAction;
