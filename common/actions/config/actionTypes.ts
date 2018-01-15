import { TypeKeys } from './constants';
import { NodeConfig, CustomNodeConfig, NetworkConfig, CustomNetworkConfig } from 'config/data';

/*** Toggle Offline ***/
export interface ToggleOfflineAction {
  type: TypeKeys.CONFIG_TOGGLE_OFFLINE;
}

export interface ToggleAutoGasLimitAction {
  type: TypeKeys.CONFIG_TOGGLE_AUTO_GAS_LIMIT;
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
    network: NetworkConfig;
  };
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
  type: TypeKeys.CONFIG_ADD_CUSTOM_NODE;
  payload: CustomNodeConfig;
}

/*** Remove Custom Node ***/
export interface RemoveCustomNodeAction {
  type: TypeKeys.CONFIG_REMOVE_CUSTOM_NODE;
  payload: CustomNodeConfig;
}

/*** Add Custom Network ***/
export interface AddCustomNetworkAction {
  type: TypeKeys.CONFIG_ADD_CUSTOM_NETWORK;
  payload: CustomNetworkConfig;
}

/*** Remove Custom Network ***/
export interface RemoveCustomNetworkAction {
  type: TypeKeys.CONFIG_REMOVE_CUSTOM_NETWORK;
  payload: CustomNetworkConfig;
}

/*** Set Latest Block ***/
export interface SetLatestBlockAction {
  type: TypeKeys.CONFIG_SET_LATEST_BLOCK;
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
  | ToggleOfflineAction
  | ToggleAutoGasLimitAction
  | PollOfflineStatus
  | ChangeNodeIntentAction
  | AddCustomNodeAction
  | RemoveCustomNodeAction
  | AddCustomNetworkAction
  | RemoveCustomNetworkAction
  | SetLatestBlockAction
  | Web3UnsetNodeAction;
