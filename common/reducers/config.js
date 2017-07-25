// @flow
import {
  NODE_CHANGE,
  LANGUAGE_CHANGE,
  GAS_PRICE_CHANGE
} from 'actions/configConstants';
import { languages, NODES } from '../config/data';

export type State = {
  // FIXME
  languageSelection: string,
  nodeSelection: string,
  gasPriceGwei: number
};

export const initialState: State = {
  languageSelection: languages[0].sign,
  nodeSelection: Object.keys(NODES)[0],
  gasPriceGwei: 21
};

export function config(state: State = initialState, action: Object): State {
  switch (action.type) {
    case LANGUAGE_CHANGE:
      return {
        ...state,
        languageSelection: action.language
      };

    case NODE_CHANGE:
      return {
        ...state,
        nodeSelection: action.node
      };

    case GAS_PRICE_CHANGE:
      return {
        ...state,
        gasPriceGwei: action.gasPrice
      };

    default:
      return state;
  }
}
