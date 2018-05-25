import { combineReducers } from 'redux';

import { MetaState, metaReducer } from './meta';
import { networksReducer, NetworksState } from './networks';
import { nodesReducer, NodesState } from './nodes';

export interface ConfigState {
  meta: MetaState;
  networks: NetworksState;
  nodes: NodesState;
}

export const configReducer = combineReducers<ConfigState>({
  meta: metaReducer,
  networks: networksReducer,
  nodes: nodesReducer
});
