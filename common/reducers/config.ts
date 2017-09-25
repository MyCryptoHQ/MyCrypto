import {
  ChangeGasPriceAction,
  ChangeLanguageAction,
  ChangeNodeAction,
  ConfigAction
} from 'actions/config';
import { TypeKeys } from 'actions/config/constants';
import { languages, NODES } from '../config/data';

export interface State {
  // FIXME
  languageSelection: string;
  nodeSelection: string;
  gasPriceGwei: number;
}

export const INITIAL_STATE: State = {
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
  state: State = INITIAL_STATE,
  action: ConfigAction
): State {
  switch (action.type) {
    case TypeKeys.CONFIG_LANGUAGE_CHANGE:
      return changeLanguage(state, action);
    case TypeKeys.CONFIG_NODE_CHANGE:
      return changeNode(state, action);
    case TypeKeys.CONFIG_GAS_PRICE:
      return changeGasPrice(state, action);
    default:
      return state;
  }
}
