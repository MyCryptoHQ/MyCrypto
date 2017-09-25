import { FetchCMCRatesSucceeded, RatesAction } from 'actions/rates';
import { TypeKeys } from 'actions/rates/constants';

// SYMBOL -> PRICE TO BUY 1 ETH
export interface State {
  [key: string]: number;
}

export const INITIAL_STATE: State = {};

function fiatSucceededRates(action: FetchCMCRatesSucceeded): State {
  return action.payload;
}

export function rates(
  state: State = INITIAL_STATE,
  action: RatesAction
): State {
  switch (action.type) {
    case TypeKeys.RATES_FETCH_CMC_SUCCEEDED:
      return fiatSucceededRates(action);
    default:
      return state;
  }
}
