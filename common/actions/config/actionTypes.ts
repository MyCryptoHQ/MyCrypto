import { TypeKeys } from './constants';

/*** Toggle Offline ***/
export interface ToggleOfflineAction {
  type: TypeKeys.CONFIG_TOGGLE_OFFLINE;
}

/*** Force Offline ***/
export interface ForceOfflineAction {
  type: TypeKeys.CONFIG_FORCE_OFFLINE;
}

/*** Change Language ***/
export interface ChangeLanguageAction {
  type: TypeKeys.CONFIG_LANGUAGE_CHANGE;
  payload: string;
}

/*** Change Node ***/
export interface ChangeNodeAction {
  type: TypeKeys.CONFIG_NODE_CHANGE;
  // FIXME $keyof?
  payload: string;
}

/*** Change gas price ***/
export interface ChangeGasPriceAction {
  type: TypeKeys.CONFIG_GAS_PRICE;
  payload: number;
}

/*** Poll offline status ***/
export interface PollOfflineStatus {
  type: TypeKeys.CONFIG_POLL_OFFLINE_STATUS;
}

/*** Change Node ***/
export interface ChangeNodeIntentAction {
  type: TypeKeys.CONFIG_NODE_CHANGE_INTENT;
  payload: string;
}

/*** Unset Web3 as a Node ***/
export interface Web3UnsetNodeAction {
  type: TypeKeys.CONFIG_NODE_WEB3_UNSET;
}

/*** Union Type ***/
export type ConfigAction =
  | ChangeNodeAction
  | ChangeLanguageAction
  | ChangeGasPriceAction
  | ToggleOfflineAction
  | PollOfflineStatus
  | ForceOfflineAction
  | ChangeNodeIntentAction
  | Web3UnsetNodeAction;
