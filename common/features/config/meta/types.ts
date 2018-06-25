export enum CONFIG_META {
  LANGUAGE_CHANGE = 'CONFIG_META_LANGUAGE_CHANGE',
  SET_ONLINE = 'CONFIG_META_SET_ONLINE',
  SET_OFFLINE = 'CONFIG_META_SET_OFFLINE',
  TOGGLE_OFFLINE = 'CONFIG_META_TOGGLE_OFFLINE',
  TOGGLE_AUTO_GAS_LIMIT = 'CONFIG_META_TOGGLE_AUTO_GAS_LIMIT',
  SET_LATEST_BLOCK = 'CONFIG_META_SET_LATEST_BLOCK'
}

export interface MetaState {
  languageSelection: string;
  offline: boolean;
  autoGasLimit: boolean;
  latestBlock: string;
}

export interface SetLatestBlockAction {
  type: CONFIG_META.SET_LATEST_BLOCK;
  payload: string;
}

export interface SetOnlineAction {
  type: CONFIG_META.SET_ONLINE;
}

export interface SetOfflineAction {
  type: CONFIG_META.SET_OFFLINE;
}

export interface ToggleAutoGasLimitAction {
  type: CONFIG_META.TOGGLE_AUTO_GAS_LIMIT;
}

export interface ChangeLanguageAction {
  type: CONFIG_META.LANGUAGE_CHANGE;
  payload: string;
}

export type MetaAction =
  | ChangeLanguageAction
  | SetOnlineAction
  | SetOfflineAction
  | ToggleAutoGasLimitAction
  | SetLatestBlockAction;
