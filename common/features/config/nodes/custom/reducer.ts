import * as types from './types';

const addCustomNode = (
  state: types.CustomNodesState,
  { payload }: types.AddCustomNodeAction
): types.CustomNodesState => ({
  ...state,
  [payload.id]: payload
});

function removeCustomNode(
  state: types.CustomNodesState,
  { payload }: types.RemoveCustomNodeAction
): types.CustomNodesState {
  const stateCopy = { ...state };
  Reflect.deleteProperty(stateCopy, payload);
  return stateCopy;
}

export function customNodesReducer(
  state: types.CustomNodesState = {},
  action: types.CustomNodeAction
): types.CustomNodesState {
  switch (action.type) {
    case types.ConfigNodesCustomActions.ADD:
      return addCustomNode(state, action);
    case types.ConfigNodesCustomActions.REMOVE:
      return removeCustomNode(state, action);
    default:
      return state;
  }
}
