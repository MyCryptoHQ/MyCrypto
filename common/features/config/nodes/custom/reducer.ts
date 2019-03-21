import * as types from './types';

const addCustomNode = (
  state: types.ConfigCustomNodesState,
  { payload }: types.AddCustomNodeAction
): types.ConfigCustomNodesState => ({
  ...state,
  [payload.id]: payload
});

function removeCustomNode(
  state: types.ConfigCustomNodesState,
  { payload }: types.RemoveCustomNodeAction
): types.ConfigCustomNodesState {
  const stateCopy = { ...state };
  Reflect.deleteProperty(stateCopy, payload);
  return stateCopy;
}

export function customNodesReducer(
  state: types.ConfigCustomNodesState = {},
  action: types.CustomNodeAction
): types.ConfigCustomNodesState {
  switch (action.type) {
    case types.ConfigNodesCustomActions.ADD:
      return addCustomNode(state, action);
    case types.ConfigNodesCustomActions.REMOVE:
      return removeCustomNode(state, action);
    default:
      return state;
  }
}
