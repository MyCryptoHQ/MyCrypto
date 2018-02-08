import { customNetworks, State as CustomNetworksState } from './customNetworks';
import { staticNetworks, State as StaticNetworksState } from './staticNetworks';
import { selectedNetwork, State as SelectedNetworkState } from './selectedNetwork';
import { combineReducers } from 'redux';

interface State {
  customNetworks: CustomNetworksState;
  staticNetworks: StaticNetworksState;
  selectedNetwork: SelectedNetworkState;
}

const networks = combineReducers<State>({
  customNetworks,
  staticNetworks,
  selectedNetwork
});

export { State, networks, StaticNetworksState, SelectedNetworkState, CustomNetworksState };
