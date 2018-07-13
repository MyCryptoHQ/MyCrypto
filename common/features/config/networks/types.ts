import * as configNetworksCustomTypes from './custom/types';
import * as configNetworksStaticTypes from './static/types';

export enum ConfigNetworksActions {
  CHANGE_NETWORK_REQUESTED = 'CONFIG_NETWORK_CHANGE_NETWORK_REQUESTED'
}

export interface NetworksState {
  customNetworks: configNetworksCustomTypes.CustomNetworksState;
  staticNetworks: configNetworksStaticTypes.StaticNetworksState;
}

export interface ChangeNetworkRequestedAction {
  type: ConfigNetworksActions.CHANGE_NETWORK_REQUESTED;
  payload: string;
}
