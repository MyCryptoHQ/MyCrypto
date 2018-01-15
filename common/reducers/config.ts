import {
  ChangeLanguageAction,
  ChangeNodeAction,
  AddCustomNodeAction,
  RemoveCustomNodeAction,
  AddCustomNetworkAction,
  RemoveCustomNetworkAction,
  SetLatestBlockAction,
  ConfigAction
} from 'actions/config';
import { TypeKeys } from 'actions/config/constants';
import {
  NODES,
  NETWORKS,
  NodeConfig,
  CustomNodeConfig,
  NetworkConfig,
  CustomNetworkConfig
} from '../config/data';
import { makeCustomNodeId } from 'utils/node';
import { makeCustomNetworkId } from 'utils/network';

export interface State {
  // FIXME
  languageSelection: string;
  nodeSelection: string;
  node: NodeConfig;
  network: NetworkConfig;
  isChangingNode: boolean;
  offline: boolean;
  autoGasLimit: boolean;
  customNodes: CustomNodeConfig[];
  customNetworks: CustomNetworkConfig[];
  latestBlock: string;
}

const defaultNode = 'eth_mew';
export const INITIAL_STATE: State = {
  languageSelection: 'en',
  nodeSelection: defaultNode,
  node: NODES[defaultNode],
  network: NETWORKS[NODES[defaultNode].network],
  isChangingNode: false,
  offline: false,
  autoGasLimit: true,
  customNodes: [],
  customNetworks: [],
  latestBlock: '???'
};

function changeLanguage(state: State, action: ChangeLanguageAction): State {
  return {
    ...state,
    languageSelection: action.payload
  };
}

function changeNode(state: State, action: ChangeNodeAction): State {
  return {
    ...state,
    nodeSelection: action.payload.nodeSelection,
    node: action.payload.node,
    network: action.payload.network,
    isChangingNode: false
  };
}

function changeNodeIntent(state: State): State {
  return {
    ...state,
    isChangingNode: true
  };
}

function toggleOffline(state: State): State {
  return {
    ...state,
    offline: !state.offline
  };
}

function toggleAutoGasLimitEstimation(state: State): State {
  return {
    ...state,
    autoGasLimit: !state.autoGasLimit
  };
}

function addCustomNode(state: State, action: AddCustomNodeAction): State {
  const newId = makeCustomNodeId(action.payload);
  return {
    ...state,
    customNodes: [
      ...state.customNodes.filter(node => makeCustomNodeId(node) !== newId),
      action.payload
    ]
  };
}

function removeCustomNode(state: State, action: RemoveCustomNodeAction): State {
  const id = makeCustomNodeId(action.payload);
  return {
    ...state,
    customNodes: state.customNodes.filter(cn => cn !== action.payload),
    nodeSelection: id === state.nodeSelection ? defaultNode : state.nodeSelection
  };
}

function addCustomNetwork(state: State, action: AddCustomNetworkAction): State {
  const newId = makeCustomNetworkId(action.payload);
  return {
    ...state,
    customNetworks: [
      ...state.customNetworks.filter(node => makeCustomNetworkId(node) !== newId),
      action.payload
    ]
  };
}

function removeCustomNetwork(state: State, action: RemoveCustomNetworkAction): State {
  return {
    ...state,
    customNetworks: state.customNetworks.filter(cn => cn !== action.payload)
  };
}

function setLatestBlock(state: State, action: SetLatestBlockAction): State {
  return {
    ...state,
    latestBlock: action.payload
  };
}

export function config(state: State = INITIAL_STATE, action: ConfigAction): State {
  switch (action.type) {
    case TypeKeys.CONFIG_LANGUAGE_CHANGE:
      return changeLanguage(state, action);
    case TypeKeys.CONFIG_NODE_CHANGE:
      return changeNode(state, action);
    case TypeKeys.CONFIG_NODE_CHANGE_INTENT:
      return changeNodeIntent(state);
    case TypeKeys.CONFIG_TOGGLE_OFFLINE:
      return toggleOffline(state);
    case TypeKeys.CONFIG_TOGGLE_AUTO_GAS_LIMIT:
      return toggleAutoGasLimitEstimation(state);
    case TypeKeys.CONFIG_ADD_CUSTOM_NODE:
      return addCustomNode(state, action);
    case TypeKeys.CONFIG_REMOVE_CUSTOM_NODE:
      return removeCustomNode(state, action);
    case TypeKeys.CONFIG_ADD_CUSTOM_NETWORK:
      return addCustomNetwork(state, action);
    case TypeKeys.CONFIG_REMOVE_CUSTOM_NETWORK:
      return removeCustomNetwork(state, action);
    case TypeKeys.CONFIG_SET_LATEST_BLOCK:
      return setLatestBlock(state, action);
    default:
      return state;
  }
}
