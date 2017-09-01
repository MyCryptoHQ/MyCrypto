// @flow

/*** Set rates ***/
export type SetRatesAction = {
  type: 'RATES_SET',
  payload: { [string]: number }
};

export function setRates(payload: { [string]: number }): SetRatesAction {
  return {
    type: 'RATES_SET',
    payload
  };
}

/*** Union Type ***/
export type RatesAction = SetRatesAction;
