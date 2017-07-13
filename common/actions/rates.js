// @flow

export type SetRatesAction = {
  type: 'RATES_SET',
  payload: { [string]: number }
};

export type RatesAction = SetRatesAction;

export function setRates(payload: { [string]: number }): SetRatesAction {
  return {
    type: 'RATES_SET',
    payload
  };
}
