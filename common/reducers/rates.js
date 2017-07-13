// @flow
import type { SetRatesAction, RatesAction } from 'actions/rates';

// SYMBOL -> PRICE TO BUY 1 ETH
export type State = {
  [key: string]: number
};

const initialState: State = {};

function setRates(state: State, action: SetRatesAction): State {
  return action.payload;
}

export function rates(state: State = initialState, action: RatesAction): State {
  switch (action.type) {
    case 'RATES_SET':
      return setRates(state, action);
    default:
      return state;
  }
}
