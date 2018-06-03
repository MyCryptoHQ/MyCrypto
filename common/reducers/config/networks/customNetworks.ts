import {
  AddCustomNetworkAction,
  RemoveCustomNetworkAction,
  CustomNetworkAction,
  TypeKeys
} from 'actions/config';
import { CustomNetworksState as State } from './types';

const addCustomNetwork = (state: State, { payload }: AddCustomNetworkAction): State => ({
  ...state,
  [payload.id]: payload
});

function removeCustomNetwork(state: State, { payload }: RemoveCustomNetworkAction): State {
  const stateCopy = { ...state };
  Reflect.deleteProperty(stateCopy, payload);
  return stateCopy;
}

export const customNetworks = (state: State = {}, action: CustomNetworkAction) => {
  switch (action.type) {
    case TypeKeys.CONFIG_ADD_CUSTOM_NETWORK:
      return addCustomNetwork(state, action);
    case TypeKeys.CONFIG_REMOVE_CUSTOM_NETWORK:
      return removeCustomNetwork(state, action);
    default:
      return state;
  }
};
