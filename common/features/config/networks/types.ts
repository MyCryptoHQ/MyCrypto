export enum CONFIG_NETWORKS {
  CHANGE_NETWORK_REQUESTED = 'CONFIG_NETWORK_CHANGE_NETWORK_REQUESTED'
}

export interface ChangeNetworkRequestedAction {
  type: CONFIG_NETWORKS.CHANGE_NETWORK_REQUESTED;
  payload: string;
}
