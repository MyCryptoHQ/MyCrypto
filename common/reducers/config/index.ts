import { meta, State as MetaState } from './meta';
import { networks, State as NetworksState } from './networks';
import { nodes, State as NodesState } from './nodes';
import { combineReducers } from 'redux';

export interface State {
  meta: MetaState;
  networks: NetworksState;
  nodes: NodesState;
}

export const config = combineReducers<State>({ meta, networks, nodes });
