import * as types from './types';

export type TAddCustomNetwork = typeof addCustomNetwork;
export function addCustomNetwork(
  payload: types.AddCustomNetworkAction['payload']
): types.AddCustomNetworkAction {
  return {
    type: types.ConfigNetworksCustomActions.ADD,
    payload
  };
}

export type TRemoveCustomNetwork = typeof removeCustomNetwork;
export function removeCustomNetwork(
  payload: types.RemoveCustomNetworkAction['payload']
): types.RemoveCustomNetworkAction {
  return {
    type: types.ConfigNetworksCustomActions.REMOVE,
    payload
  };
}
