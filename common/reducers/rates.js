// @flow
import type { SetRatesAction, RatesAction } from 'actions/rates';

// SYMBOL -> PRICE TO BUY 1 ETH
export type State = {
  [key: string]: number
};

export const INITIAL_STATE: State = {};

function setRates(state: State, action: SetRatesAction): State {
  return action.payload;
}

export function rates(
  state: State = INITIAL_STATE,
  action: RatesAction
): State {
  switch (action.type) {
    case 'RATES_SET':
      return setRates(state, action);
    default:
      return state;
  }
}
