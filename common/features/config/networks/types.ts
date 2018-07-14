import * as configNetworksCustomTypes from './custom/types';
import * as configNetworksStaticTypes from './static/types';

export enum ConfigNetworksActions {
  CHANGE_NETWORK_REQUESTED = 'CONFIG_NETWORK_CHANGE_NETWORK_REQUESTED'
}

export interface ConfigNetworksState {
  customNetworks: configNetworksCustomTypes.ConfigCustomNetworksState;
  staticNetworks: configNetworksStaticTypes.ConfigStaticNetworksState;
}

export interface ChangeNetworkRequestedAction {
  type: ConfigNetworksActions.CHANGE_NETWORK_REQUESTED;
  payload: string;
}
