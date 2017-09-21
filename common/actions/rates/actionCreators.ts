import * as interfaces from './actionTypes';
import * as constants from './constants';

export type TFiatRequestedRates = typeof fiatRequestedRates;
export function fiatRequestedRates(): interfaces.FiatRequestedRatesAction {
  return {
    type: constants.RATES_FIAT_REQUESTED
  };
}

export type TFiatSucceededRates = typeof fiatSucceededRates;
export function fiatSucceededRates(payload: {
  [key: string]: number;
}): interfaces.FiatSucceededRatesAction {
  return {
    type: constants.RATES_FIAT_SUCCEEDED,
    payload
  };
}
