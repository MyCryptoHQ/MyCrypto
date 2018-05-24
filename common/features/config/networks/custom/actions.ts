import { CONFIG_NETWORKS_CUSTOM, AddCustomNetworkAction, RemoveCustomNetworkAction } from './types';

export type TAddCustomNetwork = typeof addCustomNetwork;
export function addCustomNetwork(
  payload: AddCustomNetworkAction['payload']
): AddCustomNetworkAction {
  return {
    type: CONFIG_NETWORKS_CUSTOM.ADD,
    payload
  };
}

export type TRemoveCustomNetwork = typeof removeCustomNetwork;
export function removeCustomNetwork(
  payload: RemoveCustomNetworkAction['payload']
): RemoveCustomNetworkAction {
  return {
    type: CONFIG_NETWORKS_CUSTOM.REMOVE,
    payload
  };
}
