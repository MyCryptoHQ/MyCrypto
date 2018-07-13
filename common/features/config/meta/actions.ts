import { Theme } from 'config';
import * as configMetaTypes from './types';

export function setOnline(): configMetaTypes.SetOnlineAction {
  return {
    type: configMetaTypes.ConfigMetaActions.SET_ONLINE
  };
}

export function setOffline(): configMetaTypes.SetOfflineAction {
  return {
    type: configMetaTypes.ConfigMetaActions.SET_OFFLINE
  };
}

export type TToggleAutoGasLimit = typeof toggleAutoGasLimit;
export function toggleAutoGasLimit(): configMetaTypes.ToggleAutoGasLimitAction {
  return {
    type: configMetaTypes.ConfigMetaActions.TOGGLE_AUTO_GAS_LIMIT
  };
}

export type TChangeLanguage = typeof changeLanguage;
export function changeLanguage(sign: string): configMetaTypes.ChangeLanguageAction {
  return {
    type: configMetaTypes.ConfigMetaActions.LANGUAGE_CHANGE,
    payload: sign
  };
}

export type TChangeTheme = typeof changeTheme;
export function changeTheme(theme: Theme): configMetaTypes.ChangeThemeAction {
  return {
    type: configMetaTypes.ConfigMetaActions.THEME_CHANGE,
    payload: theme
  };
}

export type TSetLatestBlock = typeof setLatestBlock;
export function setLatestBlock(payload: string): configMetaTypes.SetLatestBlockAction {
  return {
    type: configMetaTypes.ConfigMetaActions.SET_LATEST_BLOCK,
    payload
  };
}
