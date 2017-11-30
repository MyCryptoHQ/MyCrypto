import {
  ChangeGasPriceAction,
  ChangeLanguageAction,
  ChangeNodeAction,
  AddCustomNodeAction,
  RemoveCustomNodeAction,
  SetLatestBlockAction,
  ConfigAction
} from 'actions/config';
import { TypeKeys } from 'actions/config/constants';
import { NODES, NodeConfig, CustomNodeConfig } from '../config/data';
import { makeCustomNodeId } from 'utils/node';

export interface State {
  // FIXME
  languageSelection: string;
  nodeSelection: string;
  node: NodeConfig;
  isChangingNode: boolean;
  gasPriceGwei: number;
  offline: boolean;
  forceOffline: boolean;
  customNodes: CustomNodeConfig[];
  latestBlock: string;
}

const defaultNode = 'eth_mew';
export const INITIAL_STATE: State = {
  languageSelection: 'en',
  nodeSelection: defaultNode,
  node: NODES[defaultNode],
  isChangingNode: false,
  gasPriceGwei: 21,
  offline: false,
  forceOffline: false,
  customNodes: [],
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
    isChangingNode: false
  };
}

function changeNodeIntent(state: State): State {
  return {
    ...state,
    isChangingNode: true
  };
}

function changeGasPrice(state: State, action: ChangeGasPriceAction): State {
  return {
    ...state,
    gasPriceGwei: action.payload
  };
}

function toggleOffline(state: State): State {
  return {
    ...state,
    offline: !state.offline
  };
}

function forceOffline(state: State): State {
  return {
    ...state,
    forceOffline: !state.forceOffline
  };
}

function addCustomNode(state: State, action: AddCustomNodeAction): State {
  return {
    ...state,
    customNodes: [...state.customNodes, action.payload]
  };
}

function removeCustomNode(state: State, action: RemoveCustomNodeAction): State {
  const id = makeCustomNodeId(action.payload);
  return {
    ...state,
    customNodes: state.customNodes.filter(cn => cn !== action.payload),
    nodeSelection:
      id === state.nodeSelection ? defaultNode : state.nodeSelection
  };
}

function setLatestBlock(state: State, action: SetLatestBlockAction): State {
  return {
    ...state,
    latestBlock: action.payload
  };
}

export function config(
  state: State = INITIAL_STATE,
  action: ConfigAction
): State {
  switch (action.type) {
    case TypeKeys.CONFIG_LANGUAGE_CHANGE:
      return changeLanguage(state, action);
    case TypeKeys.CONFIG_NODE_CHANGE:
      return changeNode(state, action);
    case TypeKeys.CONFIG_NODE_CHANGE_INTENT:
      return changeNodeIntent(state);
    case TypeKeys.CONFIG_GAS_PRICE:
      return changeGasPrice(state, action);
    case TypeKeys.CONFIG_TOGGLE_OFFLINE:
      return toggleOffline(state);
    case TypeKeys.CONFIG_FORCE_OFFLINE:
      return forceOffline(state);
    case TypeKeys.CONFIG_ADD_CUSTOM_NODE:
      return addCustomNode(state, action);
    case TypeKeys.CONFIG_REMOVE_CUSTOM_NODE:
      return removeCustomNode(state, action);
    case TypeKeys.CONFIG_SET_LATEST_BLOCK:
      return setLatestBlock(state, action);
    default:
      return state;
  }
}
