import { CustomNetworkConfig } from 'types/network';

export enum ConfigNetworksCustomActions {
  ADD = 'CONFIG_NETWORKS_CUSTOM_ADD',
  REMOVE = 'CONFIG_NETWORKS_CUSTOM_REMOVE'
}

export interface ConfigCustomNetworksState {
  [customNetworkId: string]: CustomNetworkConfig;
}

export interface AddCustomNetworkAction {
  type: ConfigNetworksCustomActions.ADD;
  payload: CustomNetworkConfig;
}

export interface RemoveCustomNetworkAction {
  type: ConfigNetworksCustomActions.REMOVE;
  payload: string;
}

export type CustomNetworkAction = AddCustomNetworkAction | RemoveCustomNetworkAction;
