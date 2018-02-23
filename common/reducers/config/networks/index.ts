import { customNetworks, State as CustomNetworksState } from './customNetworks';
import { staticNetworks, State as StaticNetworksState } from './staticNetworks';
import { combineReducers } from 'redux';

interface State {
  customNetworks: CustomNetworksState;
  staticNetworks: StaticNetworksState;
}

const networks = combineReducers<State>({
  customNetworks,
  staticNetworks
});

export { State, networks, StaticNetworksState, CustomNetworksState };
