import { combineReducers } from 'redux';

import { CustomNodesState, customNodesReducer } from './custom';
import { StaticNodesState, staticNodesReducer } from './static';
import { SelectedNodeState, selectedNodesReducer } from './selected';

export interface NodesState {
  customNodes: CustomNodesState;
  staticNodes: StaticNodesState;
  selectedNode: SelectedNodeState;
}

export const nodesReducer = combineReducers<NodesState>({
  customNodes: customNodesReducer,
  staticNodes: staticNodesReducer,
  selectedNode: selectedNodesReducer
});
