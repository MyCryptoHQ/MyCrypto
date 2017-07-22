// @flow
import type {
  ConfigAction,
  ChangeNodeAction,
  ChangeLanguageAction,
  ChangeGasPriceAction
} from 'actions/config';
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

function changeLanguage(state: State, action: ChangeLanguageAction): State {
  return {
    ...state,
    languageSelection: action.value
  };
}

function changeNode(state: State, action: ChangeNodeAction): State {
  return {
    ...state,
    nodeSelection: action.value
  };
}

function changeGasPrice(state: State, action: ChangeGasPriceAction): State {
  return {
    ...state,
    gasPriceGwei: action.value
  };
}

export function config(
  state: State = initialState,
  action: ConfigAction
): State {
  switch (action.type) {
    case LANGUAGE_CHANGE:
      return changeLanguage(state, action);
    case NODE_CHANGE:
      return changeNode(state, action);
    case GAS_PRICE_CHANGE:
      return changeGasPrice(state, action);
    default:
      return state;
  }
}
