import * as interfaces from './actionTypes';
import { TypeKeys } from './constants';

export type TToggleOfflineConfig = typeof toggleOfflineConfig;
export function toggleOfflineConfig(): interfaces.ToggleOfflineAction {
  return {
    type: TypeKeys.CONFIG_TOGGLE_OFFLINE
  };
}

export type TChangeLanguage = typeof changeLanguage;
export function changeLanguage(sign: string): interfaces.ChangeLanguageAction {
  return {
    type: TypeKeys.CONFIG_LANGUAGE_CHANGE,
    payload: sign
  };
}

export type TChangeNode = typeof changeNode;
export function changeNode(value: string): interfaces.ChangeNodeAction {
  return {
    type: TypeKeys.CONFIG_NODE_CHANGE,
    payload: value
  };
}

export type TChangeGasPrice = typeof changeGasPrice;
export function changeGasPrice(value: number): interfaces.ChangeGasPriceAction {
  return {
    type: TypeKeys.CONFIG_GAS_PRICE,
    payload: value
  };
}

export type TPollOfflineStatus = typeof pollOfflineStatus;
export function pollOfflineStatus(): interfaces.PollOfflineStatus {
  return {
    type: TypeKeys.CONFIG_POLL_OFFLINE_STATUS
  };
}
