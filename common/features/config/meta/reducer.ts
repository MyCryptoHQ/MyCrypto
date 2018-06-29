import {
  CONFIG_META,
  ChangeLanguageAction,
  SetLatestBlockAction,
  ChangeThemeAction,
  MetaAction,
  MetaState
} from './types';
import { Theme } from 'config';

const META_INITIAL_STATE: MetaState = {
  languageSelection: 'en',
  offline: false,
  autoGasLimit: true,
  latestBlock: '???',
  theme: Theme.LIGHT
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

function setTheme(state: MetaState, action: ChangeThemeAction): MetaState {
  return {
    ...state,
    theme: action.payload
  };
}

export function metaReducer(state: MetaState = META_INITIAL_STATE, action: MetaAction): MetaState {
  switch (action.type) {
    case CONFIG_META.LANGUAGE_CHANGE:
      return changeLanguage(state, action);

    case CONFIG_META.SET_ONLINE:
      return setOnline(state);
    case CONFIG_META.SET_OFFLINE:
      return setOffline(state);

    case CONFIG_META.TOGGLE_AUTO_GAS_LIMIT:
      return toggleAutoGasLimitEstimation(state);

    case CONFIG_META.SET_LATEST_BLOCK:
      return setLatestBlock(state, action);

    case CONFIG_META.THEME_CHANGE:
      return setTheme(state, action);

    default:
      return state;
  }
}
