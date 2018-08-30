import { combineReducers } from 'redux';

import * as configNodesCustomReducer from './custom/reducer';
import * as configNodesStaticReducer from './static/reducer';
import * as configNodesSelectedReducer from './selected/reducer';
import * as types from './types';

export const nodesReducer = combineReducers<types.ConfigNodesState>({
  customNodes: configNodesCustomReducer.customNodesReducer,
  staticNodes: configNodesStaticReducer.staticNodesReducer,
  selectedNode: configNodesSelectedReducer.selectedNodeReducer
});
