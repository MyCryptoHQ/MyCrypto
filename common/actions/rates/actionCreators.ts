import * as interfaces from './actionTypes';
import * as constants from './constants';

export type TFiatRequestedRates = typeof TFiatRequestedRates;
export function TFiatRequestedRates(): interfaces.FiatRequestedRatesAction {
  return {
    type: constants.RATES_FIAT_REQUESTED
  };
}

export function fiatSucceededRates(payload: {
  [key: string]: number;
}): interfaces.FiatSucceededRatesAction {
  return {
    type: constants.RATES_FIAT_SUCCEEDED,
    payload
  };
}
