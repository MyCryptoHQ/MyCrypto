import { CustomNetworkConfig } from 'types/network';

export enum CONFIG_NETWORKS_CUSTOM {
  ADD = 'CONFIG_NETWORKS_CUSTOM_ADD',
  REMOVE = 'CONFIG_NETWORKS_CUSTOM_REMOVE'
}

export interface AddCustomNetworkAction {
  type: CONFIG_NETWORKS_CUSTOM.ADD;
  payload: CustomNetworkConfig;
}

export interface RemoveCustomNetworkAction {
  type: CONFIG_NETWORKS_CUSTOM.REMOVE;
  payload: string;
}

export interface CustomNetworksState {
  [customNetworkId: string]: CustomNetworkConfig;
}

export type CustomNetworkAction = AddCustomNetworkAction | RemoveCustomNetworkAction;
