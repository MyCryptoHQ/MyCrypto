// @flow
import {
  NODE_CHANGE,
  LANGUAGE_CHANGE,
  GAS_PRICE_CHANGE
} from './configConstants';

export type ChangeNodeAction = {
  type: NODE_CHANGE,
  // FIXME $keyof?
  node: string
};

export type ChangeLanguageAction = {
  type: LANGUAGE_CHANGE,
  language: string
};

export type ChangeGasPriceAction = {
  type: GAS_PRICE_CHANGE,
  gasPrice: number
};

export type ConfigAction =
  | ChangeNodeAction
  | ChangeLanguageAction
  | ChangeGasPriceAction;

export function changeLanguage(language: string) {
  return {
    type: LANGUAGE_CHANGE,
    language
  };
}

export function changeNode(node: string): ChangeNodeAction {
  return {
    type: NODE_CHANGE,
    node
  };
}

export function changeGasPrice(gasPrice: number): ChangeGasPriceAction {
  return {
    type: GAS_PRICE_CHANGE,
    gasPrice
  };
}
