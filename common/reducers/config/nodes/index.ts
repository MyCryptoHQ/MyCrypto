import { customNodes, State as CustomNodesState } from './customNodes';
import { staticNodes, State as StaticNodesState } from './staticNodes';
import { selectedNode, State as SelectedNodeState } from './selectedNode';
import { combineReducers } from 'redux';

interface State {
  customNodes: CustomNodesState;
  staticNodes: StaticNodesState;
  selectedNode: SelectedNodeState;
}

const nodes = combineReducers<State>({ customNodes, staticNodes, selectedNode });

export { State, nodes, CustomNodesState, StaticNodesState, SelectedNodeState };
