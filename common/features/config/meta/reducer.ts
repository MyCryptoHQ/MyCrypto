import { Theme } from 'config';
import * as configMetaTypes from './types';

const META_INITIAL_STATE: configMetaTypes.ConfigMetaState = {
  languageSelection: 'en',
  offline: false,
  autoGasLimit: true,
  latestBlock: '???',
  theme: Theme.LIGHT
};

function changeLanguage(
  state: configMetaTypes.ConfigMetaState,
  action: configMetaTypes.ChangeLanguageAction
): configMetaTypes.ConfigMetaState {
  return {
    ...state,
    languageSelection: action.payload
  };
}

function setOnline(state: configMetaTypes.ConfigMetaState): configMetaTypes.ConfigMetaState {
  return {
    ...state,
    offline: false
  };
}

function setOffline(state: configMetaTypes.ConfigMetaState): configMetaTypes.ConfigMetaState {
  return {
    ...state,
    offline: true
  };
}

function toggleAutoGasLimitEstimation(
  state: configMetaTypes.ConfigMetaState
): configMetaTypes.ConfigMetaState {
  return {
    ...state,
    autoGasLimit: !state.autoGasLimit
  };
}

function setLatestBlock(
  state: configMetaTypes.ConfigMetaState,
  action: configMetaTypes.SetLatestBlockAction
): configMetaTypes.ConfigMetaState {
  return {
    ...state,
    latestBlock: action.payload
  };
}

function setTheme(
  state: configMetaTypes.ConfigMetaState,
  action: configMetaTypes.ChangeThemeAction
): configMetaTypes.ConfigMetaState {
  return {
    ...state,
    theme: action.payload
  };
}

export function metaReducer(
  state: configMetaTypes.ConfigMetaState = META_INITIAL_STATE,
  action: configMetaTypes.MetaAction
): configMetaTypes.ConfigMetaState {
  switch (action.type) {
    case configMetaTypes.ConfigMetaActions.LANGUAGE_CHANGE:
      return changeLanguage(state, action);

    case configMetaTypes.ConfigMetaActions.SET_ONLINE:
      return setOnline(state);
    case configMetaTypes.ConfigMetaActions.SET_OFFLINE:
      return setOffline(state);

    case configMetaTypes.ConfigMetaActions.TOGGLE_AUTO_GAS_LIMIT:
      return toggleAutoGasLimitEstimation(state);

    case configMetaTypes.ConfigMetaActions.SET_LATEST_BLOCK:
      return setLatestBlock(state, action);

    case configMetaTypes.ConfigMetaActions.THEME_CHANGE:
      return setTheme(state, action);

    default:
      return state;
  }
}
