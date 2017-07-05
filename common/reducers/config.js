// @flow
import type {
  ConfigAction,
  ChangeNodeAction,
  ChangeLanguageAction
} from 'actions/config';
import { languages, NODES } from '../config/data';

export type State = {
  // FIXME
  languageSelection: string,
  nodeSelection: string
};

export const initialState: State = {
  languageSelection: languages[0].sign,
  nodeSelection: Object.keys(NODES)[0]
};

function changeLanguage(state: State, action: ChangeLanguageAction): State {
  return {
    ...state,
    languageSelection: action.value
  };
}

function changeNode(state: State, action: ChangeNodeAction): State {
  return {
    ...state,
    nodeSelection: action.value
  };
}

export function config(
  state: State = initialState,
  action: ConfigAction
): State {
  switch (action.type) {
    case 'CONFIG_LANGUAGE_CHANGE':
      return changeLanguage(state, action);
    case 'CONFIG_NODE_CHANGE':
      return changeNode(state, action);
    default:
      return state;
  }
}
