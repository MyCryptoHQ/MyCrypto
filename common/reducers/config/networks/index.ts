import { customNetworks, State as CustomNetworksState } from './customNetworks';
import { defaultNetworks, State as DefaultNetworksState } from './defaultNetworks';
import { selectedNetwork, State as SelectedNetworkState } from './selectedNetwork';
import { combineReducers } from 'redux';

export interface State {
  customNetworks: CustomNetworksState;
  defaultNetworks: DefaultNetworksState;
  selectedNetwork: SelectedNetworkState;
}

export const networks = combineReducers<State>({
  customNetworks,
  defaultNetworks,
  selectedNetwork
});
