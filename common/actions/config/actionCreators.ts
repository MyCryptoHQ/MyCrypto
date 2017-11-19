import * as interfaces from './actionTypes';
import { TypeKeys } from './constants';
import { NodeConfig, CustomNodeConfig } from 'config/data';

export type TForceOfflineConfig = typeof forceOfflineConfig;
export function forceOfflineConfig(): interfaces.ForceOfflineAction {
  return {
    type: TypeKeys.CONFIG_FORCE_OFFLINE
  };
}

export type TToggleOfflineConfig = typeof toggleOfflineConfig;
export function toggleOfflineConfig(): interfaces.ToggleOfflineAction {
  return {
    type: TypeKeys.CONFIG_TOGGLE_OFFLINE
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
  nodeSelection: string,
  node: NodeConfig
): interfaces.ChangeNodeAction {
  return {
    type: TypeKeys.CONFIG_NODE_CHANGE,
    payload: { nodeSelection, node }
  };
}

export type TChangeGasPrice = typeof changeGasPrice;
export function changeGasPrice(value: number): interfaces.ChangeGasPriceAction {
  return {
    type: TypeKeys.CONFIG_GAS_PRICE,
    payload: value
  };
}

export type TPollOfflineStatus = typeof pollOfflineStatus;
export function pollOfflineStatus(): interfaces.PollOfflineStatus {
  return {
    type: TypeKeys.CONFIG_POLL_OFFLINE_STATUS
  };
}

export type TChangeNodeIntent = typeof changeNodeIntent;
export function changeNodeIntent(
  payload: string
): interfaces.ChangeNodeIntentAction {
  return {
    type: TypeKeys.CONFIG_NODE_CHANGE_INTENT,
    payload
  };
}

export type TAddCustomNode = typeof addCustomNode;
export function addCustomNode(
  payload: CustomNodeConfig
): interfaces.AddCustomNodeAction {
  return {
    type: TypeKeys.CONFIG_ADD_CUSTOM_NODE,
    payload
  };
}

export type TRemoveCustomNode = typeof removeCustomNode;
export function removeCustomNode(
  payload: CustomNodeConfig
): interfaces.RemoveCustomNodeAction {
  return {
    type: TypeKeys.CONFIG_REMOVE_CUSTOM_NODE,
    payload
  };
}

export type TSetLatestBlock = typeof setLatestBlock;
export function setLatestBlock(
  payload: string
): interfaces.SetLatestBlockAction {
  return {
    type: TypeKeys.CONFIG_SET_LATEST_BLOCK,
    payload
  };
}

export type TWeb3UnsetNode = typeof web3UnsetNode;
export function web3UnsetNode(): interfaces.Web3UnsetNodeAction {
  return {
    type: TypeKeys.CONFIG_NODE_WEB3_UNSET
  };
}
