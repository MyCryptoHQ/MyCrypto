import { customNodes, State as CustomNodeState } from './customNodes';
import { defaultNodes, State as DefaultNodeState } from './defaultNodes';
import { selectedNode, State as SelectedNodeState } from './selectedNode';
import { combineReducers } from 'redux';

export interface State {
  customNodes: CustomNodeState;
  defaultNodes: DefaultNodeState;
  selectedNode: SelectedNodeState;
}

export const nodes = combineReducers<State>({ customNodes, defaultNodes, selectedNode });
