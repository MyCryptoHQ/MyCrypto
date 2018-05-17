import { TypeKeys, ChangeLanguageAction, SetLatestBlockAction, MetaAction } from '../types';

export interface MetaState {
  languageSelection: string;
  offline: boolean;
  autoGasLimit: boolean;
  latestBlock: string;
}

const META_INITIAL_STATE: MetaState = {
  languageSelection: 'en',
  offline: false,
  autoGasLimit: true,
  latestBlock: '???'
};

function changeLanguage(state: MetaState, action: ChangeLanguageAction): MetaState {
  return {
    ...state,
    languageSelection: action.payload
  };
}

function setOnline(state: MetaState): MetaState {
  return {
    ...state,
    offline: false
  };
}

function setOffline(state: MetaState): MetaState {
  return {
    ...state,
    offline: true
  };
}

function toggleAutoGasLimitEstimation(state: MetaState): MetaState {
  return {
    ...state,
    autoGasLimit: !state.autoGasLimit
  };
}

function setLatestBlock(state: MetaState, action: SetLatestBlockAction): MetaState {
  return {
    ...state,
    latestBlock: action.payload
  };
}

export default function meta(state: MetaState = META_INITIAL_STATE, action: MetaAction): MetaState {
  switch (action.type) {
    case TypeKeys.CONFIG_LANGUAGE_CHANGE:
      return changeLanguage(state, action);

    case TypeKeys.CONFIG_SET_ONLINE:
      return setOnline(state);
    case TypeKeys.CONFIG_SET_OFFLINE:
      return setOffline(state);

    case TypeKeys.CONFIG_TOGGLE_AUTO_GAS_LIMIT:
      return toggleAutoGasLimitEstimation(state);

    case TypeKeys.CONFIG_SET_LATEST_BLOCK:
      return setLatestBlock(state, action);
    default:
      return state;
  }
}
