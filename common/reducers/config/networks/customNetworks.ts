import {
  AddCustomNetworkAction,
  RemoveCustomNetworkAction,
  CustomNetworkAction,
  TypeKeys
} from 'actions/config';
import { CustomNetworkConfig } from 'types/network';

// TODO: this doesn't accurately represent state, as
export interface State {
  [customNetworkId: string]: CustomNetworkConfig;
}

const addCustomNetwork = (state: State, { payload }: AddCustomNetworkAction): State => ({
  ...state,
  [payload.id]: payload.config
});

function removeCustomNetwork(state: State, { payload }: RemoveCustomNetworkAction): State {
  const stateCopy = { ...state };
  Reflect.deleteProperty(stateCopy, payload.id);
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
