import { ChangeLanguageAction, SetLatestBlockAction, ConfigAction } from 'actions/config';
import { TypeKeys } from 'actions/config/constants';

export interface State {
  // FIXME
  languageSelection: string;
  nodeSelection: string;
  isChangingNode: boolean;
  offline: boolean;
  autoGasLimit: boolean;
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

    case TypeKeys.CONFIG_TOGGLE_OFFLINE:
      return toggleOffline(state);
    case TypeKeys.CONFIG_TOGGLE_AUTO_GAS_LIMIT:
      return toggleAutoGasLimitEstimation(state);

    case TypeKeys.CONFIG_SET_LATEST_BLOCK:
      return setLatestBlock(state, action);
    default:
      return state;
  }
}
