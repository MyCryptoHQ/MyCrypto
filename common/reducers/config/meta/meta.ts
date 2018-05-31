import {
  ChangeLanguageAction,
  ChangeThemeAction,
  SetLatestBlockAction,
  MetaAction
} from 'actions/config';
import { TypeKeys } from 'actions/config/constants';
import { Theme } from 'config';

export interface State {
  languageSelection: string;
  theme: Theme;
  offline: boolean;
  autoGasLimit: boolean;
  latestBlock: string;
}

const INITIAL_STATE: State = {
  languageSelection: 'en',
  theme: Theme.LIGHT,
  offline: false,
  autoGasLimit: true,
  latestBlock: '???'
};

function changeLanguage(state: State, action: ChangeLanguageAction): State {
  return {
    ...state,
    languageSelection: action.payload
  };
}

function changeTheme(state: State, action: ChangeThemeAction): State {
  return {
    ...state,
    theme: action.payload
  };
}

function setOnline(state: State): State {
  return {
    ...state,
    offline: false
  };
}

function setOffline(state: State): State {
  return {
    ...state,
    offline: true
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

export function meta(state: State = INITIAL_STATE, action: MetaAction): State {
  switch (action.type) {
    case TypeKeys.CONFIG_LANGUAGE_CHANGE:
      return changeLanguage(state, action);

    case TypeKeys.CONFIG_THEME_CHANGE:
      return changeTheme(state, action);

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
