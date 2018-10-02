import { Theme } from 'config';
import * as types from './types';

const META_INITIAL_STATE: types.ConfigMetaState = {
  languageSelection: 'en',
  offline: false,
  autoGasLimit: true,
  latestBlock: '???',
  theme: Theme.LIGHT
};

function changeLanguage(
  state: types.ConfigMetaState,
  action: types.ChangeLanguageAction
): types.ConfigMetaState {
  return {
    ...state,
    languageSelection: action.payload
  };
}

function setOnline(state: types.ConfigMetaState): types.ConfigMetaState {
  return {
    ...state,
    offline: false
  };
}

function setOffline(state: types.ConfigMetaState): types.ConfigMetaState {
  return {
    ...state,
    offline: true
  };
}

function toggleAutoGasLimitEstimation(state: types.ConfigMetaState): types.ConfigMetaState {
  return {
    ...state,
    autoGasLimit: !state.autoGasLimit
  };
}

function setLatestBlock(
  state: types.ConfigMetaState,
  action: types.SetLatestBlockAction
): types.ConfigMetaState {
  return {
    ...state,
    latestBlock: action.payload
  };
}

function setTheme(
  state: types.ConfigMetaState,
  action: types.ChangeThemeAction
): types.ConfigMetaState {
  return {
    ...state,
    theme: action.payload
  };
}

export function metaReducer(
  state: types.ConfigMetaState = META_INITIAL_STATE,
  action: types.MetaAction
): types.ConfigMetaState {
  switch (action.type) {
    case types.ConfigMetaActions.LANGUAGE_CHANGE:
      return changeLanguage(state, action);

    case types.ConfigMetaActions.SET_ONLINE:
      return setOnline(state);
    case types.ConfigMetaActions.SET_OFFLINE:
      return setOffline(state);

    case types.ConfigMetaActions.TOGGLE_AUTO_GAS_LIMIT:
      return toggleAutoGasLimitEstimation(state);

    case types.ConfigMetaActions.SET_LATEST_BLOCK:
      return setLatestBlock(state, action);

    case types.ConfigMetaActions.THEME_CHANGE:
      return setTheme(state, action);

    default:
      return state;
  }
}
