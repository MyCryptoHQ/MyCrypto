import { combineReducers } from 'redux';
import { customNetworks } from './customNetworks';
import { staticNetworks } from './staticNetworks';
import { StaticNetworksState, CustomNetworksState } from './types';

interface State {
  customNetworks: CustomNetworksState;
  staticNetworks: StaticNetworksState;
}

const networks = combineReducers<State>({
  customNetworks,
  staticNetworks
});

export { State, networks, StaticNetworksState, CustomNetworksState };
