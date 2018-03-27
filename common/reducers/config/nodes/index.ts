import { combineReducers } from 'redux';
import { customNodes } from './customNodes';
import { staticNodes } from './staticNodes';
import { selectedNode } from './selectedNode';
import { CustomNodesState, StaticNodesState, SelectedNodeState } from './types';

interface State {
  customNodes: CustomNodesState;
  staticNodes: StaticNodesState;
  selectedNode: SelectedNodeState;
}

const nodes = combineReducers<State>({ customNodes, staticNodes, selectedNode });

export { State, nodes, CustomNodesState, StaticNodesState, SelectedNodeState };
