import { combineReducers } from 'redux';

import { customNetworksReducer, CustomNetworksState } from './custom';
import { staticNetworksReducer, StaticNetworksState } from './static';

export interface NetworksState {
  customNetworks: CustomNetworksState;
  staticNetworks: StaticNetworksState;
}

export const networksReducer = combineReducers<NetworksState>({
  customNetworks: customNetworksReducer,
  staticNetworks: staticNetworksReducer
});
