import { combineReducers } from 'redux';

import { metaReducer } from './meta/reducer';
import { networksReducer } from './networks/reducer';
import { nodesReducer } from './nodes/reducer';
import { ConfigState } from './types';

export const configReducer = combineReducers<ConfigState>({
  meta: metaReducer,
  networks: networksReducer,
  nodes: nodesReducer
});
