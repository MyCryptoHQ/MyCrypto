import { combineReducers } from 'redux';

import { customNodesReducer } from './custom/reducer';
import { staticNodesReducer } from './static/reducer';
import { selectedNodeReducer } from './selected/reducer';
import { NodesState } from './types';

export const nodesReducer = combineReducers<NodesState>({
  customNodes: customNodesReducer,
  staticNodes: staticNodesReducer,
  selectedNode: selectedNodeReducer
});
