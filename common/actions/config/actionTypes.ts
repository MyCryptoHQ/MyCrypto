import { TypeKeys } from './constants';
import { CustomNodeConfig, StaticNodeConfig } from 'types/node';
import { CustomNetworkConfig } from 'types/network';

export interface SetOnlineAction {
  type: TypeKeys.CONFIG_SET_ONLINE;
}

export interface SetOfflineAction {
  type: TypeKeys.CONFIG_SET_OFFLINE;
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
  payload: {
    nodeId: string;
    networkId: string;
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

/*** Change Node Onetime ***/
export interface ChangeNodeIntentOneTimeAction {
  type: TypeKeys.CONFIG_NODE_CHANGE_INTENT_ONETIME;
  payload: string;
}

/*** Force Change Node ***/
export interface ChangeNodeForceAction {
  type: TypeKeys.CONFIG_NODE_CHANGE_FORCE;
  payload: string;
}

/*** Add Custom Node ***/
export interface AddCustomNodeAction {
  type: TypeKeys.CONFIG_ADD_CUSTOM_NODE;
  payload: { id: string; config: CustomNodeConfig };
}

/*** Remove Custom Node ***/
export interface RemoveCustomNodeAction {
  type: TypeKeys.CONFIG_REMOVE_CUSTOM_NODE;
  payload: { id: string };
}

/*** Add Custom Network ***/
export interface AddCustomNetworkAction {
  type: TypeKeys.CONFIG_ADD_CUSTOM_NETWORK;
  payload: { id: string; config: CustomNetworkConfig };
}

/*** Remove Custom Network ***/
export interface RemoveCustomNetworkAction {
  type: TypeKeys.CONFIG_REMOVE_CUSTOM_NETWORK;
  payload: { id: string };
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

/*** Set Web3 as a Node ***/
export interface Web3setNodeAction {
  type: TypeKeys.CONFIG_NODE_WEB3_SET;
  payload: { id: 'web3'; config: StaticNodeConfig };
}

export type CustomNetworkAction = AddCustomNetworkAction | RemoveCustomNetworkAction;

export type CustomNodeAction = AddCustomNodeAction | RemoveCustomNodeAction;

export type NodeAction =
  | ChangeNodeAction
  | ChangeNodeIntentAction
  | Web3UnsetNodeAction
  | Web3setNodeAction;

export type MetaAction =
  | ChangeLanguageAction
  | SetOnlineAction
  | SetOfflineAction
  | ToggleAutoGasLimitAction
  | PollOfflineStatus
  | SetLatestBlockAction;

/*** Union Type ***/
export type ConfigAction = CustomNetworkAction | CustomNodeAction | NodeAction | MetaAction;
