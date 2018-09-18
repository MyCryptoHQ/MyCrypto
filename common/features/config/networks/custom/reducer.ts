import * as types from './types';

const addCustomNetwork = (
  state: types.ConfigCustomNetworksState,
  { payload }: types.AddCustomNetworkAction
): types.ConfigCustomNetworksState => ({
  ...state,
  [payload.id]: payload
});

function removeCustomNetwork(
  state: types.ConfigCustomNetworksState,
  { payload }: types.RemoveCustomNetworkAction
): types.ConfigCustomNetworksState {
  const stateCopy = { ...state };
  Reflect.deleteProperty(stateCopy, payload);
  return stateCopy;
}

export function customNetworksReducer(
  state: types.ConfigCustomNetworksState = {},
  action: types.CustomNetworkAction
) {
  switch (action.type) {
    case types.ConfigNetworksCustomActions.ADD:
      return addCustomNetwork(state, action);
    case types.ConfigNetworksCustomActions.REMOVE:
      return removeCustomNetwork(state, action);
    default:
      return state;
  }
}
