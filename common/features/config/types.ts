import { InsecureWalletName, SecureWalletName } from 'config';
import { CustomNodeConfig, StaticNodeConfig } from 'types/node';
import { CustomNetworkConfig, DPathFormats } from 'types/network';

export enum TypeKeys {
  CONFIG_LANGUAGE_CHANGE = 'CONFIG_LANGUAGE_CHANGE',
  CONFIG_SET_ONLINE = 'CONFIG_SET_ONLINE',
  CONFIG_SET_OFFLINE = 'CONFIG_SET_OFFLINE',
  CONFIG_TOGGLE_OFFLINE = 'CONFIG_TOGGLE_OFFLINE',
  CONFIG_TOGGLE_AUTO_GAS_LIMIT = 'CONFIG_TOGGLE_AUTO_GAS_LIMIT',
  CONFIG_POLL_OFFLINE_STATUS = 'CONFIG_POLL_OFFLINE_STATUS',
  CONFIG_SET_LATEST_BLOCK = 'CONFIG_SET_LATEST_BLOCK',
  CONFIG_NODE_WEB3_SET = 'CONFIG_NODE_WEB3_SET',
  CONFIG_NODE_WEB3_UNSET = 'CONFIG_NODE_WEB3_UNSET',
  CONFIG_NODE_CHANGE = 'CONFIG_NODE_CHANGE',
  CONFIG_NODE_CHANGE_INTENT = 'CONFIG_NODE_CHANGE_INTENT',
  CONFIG_NODE_CHANGE_INTENT_ONETIME = 'CONFIG_NODE_CHANGE_INTENT_ONETIME',
  CONFIG_NODE_CHANGE_FORCE = 'CONFIG_NODE_CHANGE_FORCE',
  CONFIG_ADD_CUSTOM_NODE = 'CONFIG_ADD_CUSTOM_NODE',
  CONFIG_REMOVE_CUSTOM_NODE = 'CONFIG_REMOVE_CUSTOM_NODE',
  CONFIG_ADD_CUSTOM_NETWORK = 'CONFIG_ADD_CUSTOM_NETWORK',
  CONFIG_REMOVE_CUSTOM_NETWORK = 'CONFIG_REMOVE_CUSTOM_NETWORK'
}

export interface SetOnlineAction {
  type: TypeKeys.CONFIG_SET_ONLINE;
}

export interface SetOfflineAction {
  type: TypeKeys.CONFIG_SET_OFFLINE;
}

export interface ToggleAutoGasLimitAction {
  type: TypeKeys.CONFIG_TOGGLE_AUTO_GAS_LIMIT;
}

export interface ChangeLanguageAction {
  type: TypeKeys.CONFIG_LANGUAGE_CHANGE;
  payload: string;
}

export interface ChangeNodeAction {
  type: TypeKeys.CONFIG_NODE_CHANGE;
  payload: {
    nodeId: string;
    networkId: string;
  };
}

export interface PollOfflineStatus {
  type: TypeKeys.CONFIG_POLL_OFFLINE_STATUS;
}

export interface ChangeNodeIntentAction {
  type: TypeKeys.CONFIG_NODE_CHANGE_INTENT;
  payload: string;
}

export interface ChangeNodeIntentOneTimeAction {
  type: TypeKeys.CONFIG_NODE_CHANGE_INTENT_ONETIME;
  payload: string;
}

export interface ChangeNodeForceAction {
  type: TypeKeys.CONFIG_NODE_CHANGE_FORCE;
  payload: string;
}

export interface AddCustomNodeAction {
  type: TypeKeys.CONFIG_ADD_CUSTOM_NODE;
  payload: { id: string; config: CustomNodeConfig };
}

export interface RemoveCustomNodeAction {
  type: TypeKeys.CONFIG_REMOVE_CUSTOM_NODE;
  payload: { id: string };
}

export interface AddCustomNetworkAction {
  type: TypeKeys.CONFIG_ADD_CUSTOM_NETWORK;
  payload: { id: string; config: CustomNetworkConfig };
}

export interface RemoveCustomNetworkAction {
  type: TypeKeys.CONFIG_REMOVE_CUSTOM_NETWORK;
  payload: { id: string };
}

export interface SetLatestBlockAction {
  type: TypeKeys.CONFIG_SET_LATEST_BLOCK;
  payload: string;
}

export interface Web3UnsetNodeAction {
  type: TypeKeys.CONFIG_NODE_WEB3_UNSET;
}

export interface Web3setNodeAction {
  type: TypeKeys.CONFIG_NODE_WEB3_SET;
  payload: { id: 'web3'; config: StaticNodeConfig };
}

export type CustomNetworkAction = AddCustomNetworkAction | RemoveCustomNetworkAction;

export type CustomNodeAction = AddCustomNodeAction | RemoveCustomNodeAction;

export type ConfigAction = CustomNetworkAction | CustomNodeAction | NodeAction | MetaAction;

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

export type PathType = keyof DPathFormats;

export type DPathFormat =
  | SecureWalletName.TREZOR
  | SecureWalletName.LEDGER_NANO_S
  | InsecureWalletName.MNEMONIC_PHRASE;
