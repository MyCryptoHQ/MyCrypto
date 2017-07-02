// @flow
import { CONFIG_LANGUAGE_CHANGE, CONFIG_NODE_CHANGE } from 'actions/config';
import { languages, nodeList } from '../config/data';

export type State = {
  // FIXME
  languageSelection: string,
  nodeSelection: string
};

const initialState = {
  languageSelection: languages[0],
  nodeSelection: nodeList[0]
};

export function config(state: State = initialState, action): State {
  switch (action.type) {
    case CONFIG_LANGUAGE_CHANGE: {
      return {
        ...state,
        languageSelection: action.value
      };
    }
    case CONFIG_NODE_CHANGE: {
      return {
        ...state,
        nodeSelection: action.value
      };
    }
    default:
      return state;
  }
}
