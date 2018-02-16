import * as interfaces from './actionTypes';
import { TypeKeys } from './constants';

export type TToggleOffline = typeof toggleOffline;
export function toggleOffline(): interfaces.ToggleOfflineAction {
  return {
    type: TypeKeys.CONFIG_TOGGLE_OFFLINE
  };
}

export type TToggleAutoGasLimit = typeof toggleAutoGasLimit;
export function toggleAutoGasLimit(): interfaces.ToggleAutoGasLimitAction {
  return {
    type: TypeKeys.CONFIG_TOGGLE_AUTO_GAS_LIMIT
  };
}

export type TChangeLanguage = typeof changeLanguage;
export function changeLanguage(sign: string): interfaces.ChangeLanguageAction {
  return {
    type: TypeKeys.CONFIG_LANGUAGE_CHANGE,
    payload: sign
  };
}

export type TChangeNode = typeof changeNode;
export function changeNode(
  payload: interfaces.ChangeNodeAction['payload']
): interfaces.ChangeNodeAction {
  return {
    type: TypeKeys.CONFIG_NODE_CHANGE,
    payload
  };
}

export type TPollOfflineStatus = typeof pollOfflineStatus;
export function pollOfflineStatus(): interfaces.PollOfflineStatus {
  return {
    type: TypeKeys.CONFIG_POLL_OFFLINE_STATUS
  };
}

export type TChangeNodeIntent = typeof changeNodeIntent;
export function changeNodeIntent(payload: string): interfaces.ChangeNodeIntentAction {
  return {
    type: TypeKeys.CONFIG_NODE_CHANGE_INTENT,
    payload
  };
}

export type TAddCustomNode = typeof addCustomNode;
export function addCustomNode(
  payload: interfaces.AddCustomNodeAction['payload']
): interfaces.AddCustomNodeAction {
  return {
    type: TypeKeys.CONFIG_ADD_CUSTOM_NODE,
    payload
  };
}

export type TRemoveCustomNode = typeof removeCustomNode;
export function removeCustomNode(
  payload: interfaces.RemoveCustomNodeAction['payload']
): interfaces.RemoveCustomNodeAction {
  return {
    type: TypeKeys.CONFIG_REMOVE_CUSTOM_NODE,
    payload
  };
}

export type TAddCustomNetwork = typeof addCustomNetwork;
export function addCustomNetwork(
  payload: interfaces.AddCustomNetworkAction['payload']
): interfaces.AddCustomNetworkAction {
  return {
    type: TypeKeys.CONFIG_ADD_CUSTOM_NETWORK,
    payload
  };
}

export type TRemoveCustomNetwork = typeof removeCustomNetwork;
export function removeCustomNetwork(
  payload: interfaces.RemoveCustomNetworkAction['payload']
): interfaces.RemoveCustomNetworkAction {
  return {
    type: TypeKeys.CONFIG_REMOVE_CUSTOM_NETWORK,
    payload
  };
}

export type TSetLatestBlock = typeof setLatestBlock;
export function setLatestBlock(payload: string): interfaces.SetLatestBlockAction {
  return {
    type: TypeKeys.CONFIG_SET_LATEST_BLOCK,
    payload
  };
}

export function web3SetNode(
  payload: interfaces.Web3setNodeAction['payload']
): interfaces.Web3setNodeAction {
  return {
    type: TypeKeys.CONFIG_NODE_WEB3_SET,
    payload
  };
}

export type TWeb3UnsetNode = typeof web3UnsetNode;
export function web3UnsetNode(): interfaces.Web3UnsetNodeAction {
  return {
    type: TypeKeys.CONFIG_NODE_WEB3_UNSET
  };
}
