import {
  CONFIG_META,
  ChangeLanguageAction,
  SetLatestBlockAction,
  SetOfflineAction,
  SetOnlineAction,
  ToggleAutoGasLimitAction
} from './types';

export function setOnline(): SetOnlineAction {
  return {
    type: CONFIG_META.SET_ONLINE
  };
}

export function setOffline(): SetOfflineAction {
  return {
    type: CONFIG_META.SET_OFFLINE
  };
}

export type TToggleAutoGasLimit = typeof toggleAutoGasLimit;
export function toggleAutoGasLimit(): ToggleAutoGasLimitAction {
  return {
    type: CONFIG_META.TOGGLE_AUTO_GAS_LIMIT
  };
}

export type TChangeLanguage = typeof changeLanguage;
export function changeLanguage(sign: string): ChangeLanguageAction {
  return {
    type: CONFIG_META.LANGUAGE_CHANGE,
    payload: sign
  };
}

export type TSetLatestBlock = typeof setLatestBlock;
export function setLatestBlock(payload: string): SetLatestBlockAction {
  return {
    type: CONFIG_META.SET_LATEST_BLOCK,
    payload
  };
}
