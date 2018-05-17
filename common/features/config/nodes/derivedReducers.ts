import { combineReducers } from 'redux';

import customNodes, { CustomNodesState } from './custom/reducers';
import staticNodes, { StaticNodesState } from './static/reducers';
import selectedNode, { SelectedNodeState } from './selected/reducers';

export interface NodesState {
  customNodes: CustomNodesState;
  staticNodes: StaticNodesState;
  selectedNode: SelectedNodeState;
}

export default combineReducers<NodesState>({ customNodes, staticNodes, selectedNode });
