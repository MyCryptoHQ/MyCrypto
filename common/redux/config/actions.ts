import {
  TypeKeys,
  SetOnlineAction,
  SetOfflineAction,
  ToggleAutoGasLimitAction,
  ChangeLanguageAction,
  ChangeNodeAction,
  PollOfflineStatus,
  ChangeNodeIntentAction,
  ChangeNodeIntentOneTimeAction,
  ChangeNodeForceAction,
  AddCustomNodeAction,
  RemoveCustomNodeAction,
  AddCustomNetworkAction,
  RemoveCustomNetworkAction,
  SetLatestBlockAction,
  Web3setNodeAction,
  Web3UnsetNodeAction
} from './types';

export function setOnline(): SetOnlineAction {
  return {
    type: TypeKeys.CONFIG_SET_ONLINE
  };
}

export function setOffline(): SetOfflineAction {
  return {
    type: TypeKeys.CONFIG_SET_OFFLINE
  };
}

export type TToggleAutoGasLimit = typeof toggleAutoGasLimit;
export function toggleAutoGasLimit(): ToggleAutoGasLimitAction {
  return {
    type: TypeKeys.CONFIG_TOGGLE_AUTO_GAS_LIMIT
  };
}

export type TChangeLanguage = typeof changeLanguage;
export function changeLanguage(sign: string): ChangeLanguageAction {
  return {
    type: TypeKeys.CONFIG_LANGUAGE_CHANGE,
    payload: sign
  };
}

export type TChangeNode = typeof changeNode;
export function changeNode(payload: ChangeNodeAction['payload']): ChangeNodeAction {
  return {
    type: TypeKeys.CONFIG_NODE_CHANGE,
    payload
  };
}

export type TPollOfflineStatus = typeof pollOfflineStatus;
export function pollOfflineStatus(): PollOfflineStatus {
  return {
    type: TypeKeys.CONFIG_POLL_OFFLINE_STATUS
  };
}

export type TChangeNodeIntent = typeof changeNodeIntent;
export function changeNodeIntent(payload: string): ChangeNodeIntentAction {
  return {
    type: TypeKeys.CONFIG_NODE_CHANGE_INTENT,
    payload
  };
}

export type TChangeNodeIntentOneTime = typeof changeNodeIntentOneTime;
export function changeNodeIntentOneTime(payload: string): ChangeNodeIntentOneTimeAction {
  return {
    type: TypeKeys.CONFIG_NODE_CHANGE_INTENT_ONETIME,
    payload
  };
}

export type TChangeNodeForce = typeof changeNodeForce;
export function changeNodeForce(payload: string): ChangeNodeForceAction {
  return {
    type: TypeKeys.CONFIG_NODE_CHANGE_FORCE,
    payload
  };
}

export type TAddCustomNode = typeof addCustomNode;
export function addCustomNode(payload: AddCustomNodeAction['payload']): AddCustomNodeAction {
  return {
    type: TypeKeys.CONFIG_ADD_CUSTOM_NODE,
    payload
  };
}

export type TRemoveCustomNode = typeof removeCustomNode;
export function removeCustomNode(
  payload: RemoveCustomNodeAction['payload']
): RemoveCustomNodeAction {
  return {
    type: TypeKeys.CONFIG_REMOVE_CUSTOM_NODE,
    payload
  };
}

export type TAddCustomNetwork = typeof addCustomNetwork;
export function addCustomNetwork(
  payload: AddCustomNetworkAction['payload']
): AddCustomNetworkAction {
  return {
    type: TypeKeys.CONFIG_ADD_CUSTOM_NETWORK,
    payload
  };
}

export type TRemoveCustomNetwork = typeof removeCustomNetwork;
export function removeCustomNetwork(
  payload: RemoveCustomNetworkAction['payload']
): RemoveCustomNetworkAction {
  return {
    type: TypeKeys.CONFIG_REMOVE_CUSTOM_NETWORK,
    payload
  };
}

export type TSetLatestBlock = typeof setLatestBlock;
export function setLatestBlock(payload: string): SetLatestBlockAction {
  return {
    type: TypeKeys.CONFIG_SET_LATEST_BLOCK,
    payload
  };
}

export function web3SetNode(payload: Web3setNodeAction['payload']): Web3setNodeAction {
  return {
    type: TypeKeys.CONFIG_NODE_WEB3_SET,
    payload
  };
}

export type TWeb3UnsetNode = typeof web3UnsetNode;
export function web3UnsetNode(): Web3UnsetNodeAction {
  return {
    type: TypeKeys.CONFIG_NODE_WEB3_UNSET
  };
}
