import { CustomNetworksState } from './custom/types';
import { StaticNetworksState } from './static/types';

export enum CONFIG_NETWORKS {
  CHANGE_NETWORK_REQUESTED = 'CONFIG_NETWORK_CHANGE_NETWORK_REQUESTED'
}

export interface NetworksState {
  customNetworks: CustomNetworksState;
  staticNetworks: StaticNetworksState;
}

export interface ChangeNetworkRequestedAction {
  type: CONFIG_NETWORKS.CHANGE_NETWORK_REQUESTED;
  payload: string;
}
