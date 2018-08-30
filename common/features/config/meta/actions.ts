import { Theme } from 'config';
import * as types from './types';

export function setOnline(): types.SetOnlineAction {
  return {
    type: types.ConfigMetaActions.SET_ONLINE
  };
}

export function setOffline(): types.SetOfflineAction {
  return {
    type: types.ConfigMetaActions.SET_OFFLINE
  };
}

export type TToggleAutoGasLimit = typeof toggleAutoGasLimit;
export function toggleAutoGasLimit(): types.ToggleAutoGasLimitAction {
  return {
    type: types.ConfigMetaActions.TOGGLE_AUTO_GAS_LIMIT
  };
}

export type TChangeLanguage = typeof changeLanguage;
export function changeLanguage(sign: string): types.ChangeLanguageAction {
  return {
    type: types.ConfigMetaActions.LANGUAGE_CHANGE,
    payload: sign
  };
}

export type TChangeTheme = typeof changeTheme;
export function changeTheme(theme: Theme): types.ChangeThemeAction {
  return {
    type: types.ConfigMetaActions.THEME_CHANGE,
    payload: theme
  };
}

export type TSetLatestBlock = typeof setLatestBlock;
export function setLatestBlock(payload: string): types.SetLatestBlockAction {
  return {
    type: types.ConfigMetaActions.SET_LATEST_BLOCK,
    payload
  };
}
