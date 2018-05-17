import { CustomNetworkConfig } from 'types/network';
import {
  TypeKeys,
  AddCustomNetworkAction,
  RemoveCustomNetworkAction,
  CustomNetworkAction
} from '../../types';

export interface CustomNetworksState {
  [customNetworkId: string]: CustomNetworkConfig;
}

const addCustomNetwork = (
  state: CustomNetworksState,
  { payload }: AddCustomNetworkAction
): CustomNetworksState => ({
  ...state,
  [payload.id]: payload.config
});

function removeCustomNetwork(
  state: CustomNetworksState,
  { payload }: RemoveCustomNetworkAction
): CustomNetworksState {
  const stateCopy = { ...state };
  Reflect.deleteProperty(stateCopy, payload.id);
  return stateCopy;
}

export default function customNetworks(
  state: CustomNetworksState = {},
  action: CustomNetworkAction
) {
  switch (action.type) {
    case TypeKeys.CONFIG_ADD_CUSTOM_NETWORK:
      return addCustomNetwork(state, action);
    case TypeKeys.CONFIG_REMOVE_CUSTOM_NETWORK:
      return removeCustomNetwork(state, action);
    default:
      return state;
  }
}
