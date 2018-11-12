import { combineReducers } from 'redux';

import * as configMetaReducer from './meta/reducer';
import * as configNetworksReducer from './networks/reducer';
import * as configNodesReducer from './nodes/reducer';
import * as types from './types';

export const configReducer = combineReducers<types.ConfigState>({
  meta: configMetaReducer.metaReducer,
  networks: configNetworksReducer.networksReducer,
  nodes: configNodesReducer.nodesReducer
});
