import {
  CONFIG_NETWORKS_CUSTOM,
  AddCustomNetworkAction,
  RemoveCustomNetworkAction,
  CustomNetworkAction,
  CustomNetworksState
} from './types';

const addCustomNetwork = (
  state: CustomNetworksState,
  { payload }: AddCustomNetworkAction
): CustomNetworksState => ({
  ...state,
  [payload.id]: payload
});

function removeCustomNetwork(
  state: CustomNetworksState,
  { payload }: RemoveCustomNetworkAction
): CustomNetworksState {
  const stateCopy = { ...state };
  Reflect.deleteProperty(stateCopy, payload);
  return stateCopy;
}

export function customNetworksReducer(
  state: CustomNetworksState = {},
  action: CustomNetworkAction
) {
  switch (action.type) {
    case CONFIG_NETWORKS_CUSTOM.ADD:
      return addCustomNetwork(state, action);
    case CONFIG_NETWORKS_CUSTOM.REMOVE:
      return removeCustomNetwork(state, action);
    default:
      return state;
  }
}
