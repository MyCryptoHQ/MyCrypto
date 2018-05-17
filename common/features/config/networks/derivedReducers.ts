import { combineReducers } from 'redux';

import customNetworks, { CustomNetworksState } from './custom/reducers';
import staticNetworks, { StaticNetworksState } from './static/reducers';

export interface NetworksState {
  customNetworks: CustomNetworksState;
  staticNetworks: StaticNetworksState;
}

export default combineReducers<NetworksState>({
  customNetworks,
  staticNetworks
});
