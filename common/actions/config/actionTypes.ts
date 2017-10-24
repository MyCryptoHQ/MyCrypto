import { TypeKeys } from './constants';
import { CustomNodeConfig, NodeConfig } from 'config/data';

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
  payload: {
    nodeSelection: string;
    node: NodeConfig;
  };
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

/*** Add Custom Node ***/
export interface AddCustomNodeAction {
  type: TypeKeys.CONFIG_ADD_CUSTOM_NODE,
  payload: CustomNodeConfig;
}

/*** Remove Custom Node ***/
export interface RemoveCustomNodeAction {
  type: TypeKeys.CONFIG_REMOVE_CUSTOM_NODE,
  payload: CustomNodeConfig;
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
  | AddCustomNodeAction
  | RemoveCustomNodeAction;
