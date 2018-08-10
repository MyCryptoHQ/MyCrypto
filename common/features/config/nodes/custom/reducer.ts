import {
  CONFIG_NODES_CUSTOM,
  RemoveCustomNodeAction,
  AddCustomNodeAction,
  CustomNodesState,
  CustomNodeAction
} from './types';

const addCustomNode = (
  state: CustomNodesState,
  { payload }: AddCustomNodeAction
): CustomNodesState => ({
  ...state,
  [payload.id]: payload
});

function removeCustomNode(
  state: CustomNodesState,
  { payload }: RemoveCustomNodeAction
): CustomNodesState {
  const stateCopy = { ...state };
  Reflect.deleteProperty(stateCopy, payload);
  return stateCopy;
}

export function customNodesReducer(
  state: CustomNodesState = {},
  action: CustomNodeAction
): CustomNodesState {
  switch (action.type) {
    case CONFIG_NODES_CUSTOM.ADD:
      return addCustomNode(state, action);
    case CONFIG_NODES_CUSTOM.REMOVE:
      return removeCustomNode(state, action);
    default:
      return state;
  }
}
