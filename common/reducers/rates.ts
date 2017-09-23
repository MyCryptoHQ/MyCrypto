import { FiatSucceededRatesAction, RatesAction } from 'actions/rates';
import { TypeKeys } from 'actions/rates/constants';
// SYMBOL -> PRICE TO BUY 1 ETH
export interface State {
  [key: string]: number;
}

export const INITIAL_STATE: State = {};

function fiatSucceededRates(
  state: State,
  action: FiatSucceededRatesAction
): State {
  return action.payload;
}

export function rates(
  state: State = INITIAL_STATE,
  action: RatesAction
): State {
  switch (action.type) {
    case TypeKeys.RATES_FIAT_SUCCEEDED:
      return fiatSucceededRates(state, action);
    default:
      return state;
  }
}
