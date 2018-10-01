import { Theme } from 'config';

export interface ConfigMetaState {
  languageSelection: string;
  offline: boolean;
  autoGasLimit: boolean;
  latestBlock: string;
  theme: Theme;
}

export enum ConfigMetaActions {
  LANGUAGE_CHANGE = 'CONFIG_META_LANGUAGE_CHANGE',
  SET_ONLINE = 'CONFIG_META_SET_ONLINE',
  SET_OFFLINE = 'CONFIG_META_SET_OFFLINE',
  TOGGLE_OFFLINE = 'CONFIG_META_TOGGLE_OFFLINE',
  TOGGLE_AUTO_GAS_LIMIT = 'CONFIG_META_TOGGLE_AUTO_GAS_LIMIT',
  SET_LATEST_BLOCK = 'CONFIG_META_SET_LATEST_BLOCK',
  THEME_CHANGE = 'CONFIG_THEME_CHANGE'
}

export interface SetLatestBlockAction {
  type: ConfigMetaActions.SET_LATEST_BLOCK;
  payload: string;
}

export interface SetOnlineAction {
  type: ConfigMetaActions.SET_ONLINE;
}

export interface SetOfflineAction {
  type: ConfigMetaActions.SET_OFFLINE;
}

export interface ToggleAutoGasLimitAction {
  type: ConfigMetaActions.TOGGLE_AUTO_GAS_LIMIT;
}

export interface ChangeLanguageAction {
  type: ConfigMetaActions.LANGUAGE_CHANGE;
  payload: string;
}

export interface ChangeThemeAction {
  type: ConfigMetaActions.THEME_CHANGE;
  payload: Theme;
}

export type MetaAction =
  | ChangeLanguageAction
  | SetOnlineAction
  | SetOfflineAction
  | ToggleAutoGasLimitAction
  | SetLatestBlockAction
  | ChangeThemeAction;
