// @flow
import { languages, NODES } from '../config/data';
import type {
  ChangeNodeAction,
  ChangeLanguageAction,
  ChangeGasPriceAction
} from 'actions/config';

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

type Action = ChangeNodeAction | ChangeLanguageAction | ChangeGasPriceAction;

export function config(state: State = initialState, action: Action): State {
  switch (action.type) {
    case 'CONFIG_LANGUAGE_CHANGE':
      return {
        ...state,
        languageSelection: action.language
      };

    case 'CONFIG_NODE_CHANGE':
      return {
        ...state,
        nodeSelection: action.node
      };

    case 'CONFIG_GAS_PRICE_CHANGE':
      return {
        ...state,
        gasPriceGwei: action.gasPrice
      };

    default:
      return state;
  }
}
