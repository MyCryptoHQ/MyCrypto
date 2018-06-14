import { combineReducers } from 'redux';

import { customNetworksReducer } from './custom/reducer';
import { staticNetworksReducer } from './static/reducer';
import { NetworksState } from './types';

export const networksReducer = combineReducers<NetworksState>({
  customNetworks: customNetworksReducer,
  staticNetworks: staticNetworksReducer
});
