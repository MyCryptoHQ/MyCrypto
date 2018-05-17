import { combineReducers } from 'redux';

import meta, { MetaState } from './meta/reducers';
import networks, { NetworksState } from './networks/derivedReducers';
import nodes, { NodesState } from './nodes/derivedReducers';

export interface State {
  meta: MetaState;
  networks: NetworksState;
  nodes: NodesState;
}

export default combineReducers<State>({ meta, networks, nodes });
