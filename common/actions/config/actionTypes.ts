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

/*** Poll offline status ***/
export interface PollOfflineStatus {
  type: TypeKeys.CONFIG_POLL_OFFLINE_STATUS;
}

/*** Change Node Requested ***/
export interface ChangeNodeRequestedAction {
  type: TypeKeys.CONFIG_CHANGE_NODE_REQUESTED;
  payload: string;
}

/*** Change Node Succeeded ***/
export interface ChangeNodeSucceededAction {
  type: TypeKeys.CONFIG_CHANGE_NODE_SUCCEEDED;
  payload: {
    nodeId: string;
    networkId: string;
  };
}

/*** Change Node Failed ***/
export interface ChangeNodeFailedAction {
  type: TypeKeys.CONFIG_CHANGE_NODE_FAILED;
}

/*** Change Node Onetime ***/
export interface ChangeNodeRequestedOneTimeAction {
  type: TypeKeys.CONFIG_CHANGE_NODE_REQUESTED_ONETIME;
  payload: string;
}

/*** Force Change Node ***/
export interface ChangeNodeForceAction {
  type: TypeKeys.CONFIG_CHANGE_NODE_FORCE;
  payload: string;
}

/*** Change Network Intent ***/
export interface ChangeNetworkRequestedAction {
  type: TypeKeys.CONFIG_CHANGE_NETWORK_REQUESTED;
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
  payload: string;
}

/*** Add Custom Network ***/
export interface AddCustomNetworkAction {
  type: TypeKeys.CONFIG_ADD_CUSTOM_NETWORK;
  payload: CustomNetworkConfig;
}

/*** Remove Custom Network ***/
export interface RemoveCustomNetworkAction {
  type: TypeKeys.CONFIG_REMOVE_CUSTOM_NETWORK;
  payload: string;
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
  | ChangeNodeSucceededAction
  | ChangeNodeRequestedAction
  | ChangeNodeFailedAction
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
