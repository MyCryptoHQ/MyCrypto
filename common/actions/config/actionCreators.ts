import * as interfaces from './actionTypes';
import { TypeKeys } from './constants';

export type TChangeLanguage = typeof changeLanguage;
export function changeLanguage(sign: string): interfaces.ChangeLanguageAction {
  return {
    type: TypeKeys.CONFIG_LANGUAGE_CHANGE,
    value: sign
  };
}

export type TChangeNode = typeof changeNode;
export function changeNode(value: string): interfaces.ChangeNodeAction {
  return {
    type: TypeKeys.CONFIG_NODE_CHANGE,
    value
  };
}

export type TChangeGasPrice = typeof changeGasPrice;
export function changeGasPrice(value: number): interfaces.ChangeGasPriceAction {
  return {
    type: TypeKeys.CONFIG_GAS_PRICE,
    value
  };
}
