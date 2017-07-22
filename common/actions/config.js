// @flow
import {
  NODE_CHANGE,
  LANGUAGE_CHANGE,
  GAS_PRICE_CHANGE
} from './configConstants';

export type ChangeNodeAction = {
  type: NODE_CHANGE,
  // FIXME $keyof?
  value: string
};

export type ChangeLanguageAction = {
  type: LANGUAGE_CHANGE,
  value: string
};

export type ChangeGasPriceAction = {
  type: GAS_PRICE_CHANGE,
  value: number
};

export type ConfigAction = ChangeNodeAction | ChangeLanguageAction;

export function changeLanguage(sign: string) {
  return {
    type: LANGUAGE_CHANGE,
    value: sign
  };
}

export function changeNode(value: string): ChangeNodeAction {
  return {
    type: NODE_CHANGE,
    value
  };
}

export function changeGasPrice(value: number): ChangeGasPriceAction {
  return {
    type: GAS_PRICE_CHANGE,
    value
  };
}
