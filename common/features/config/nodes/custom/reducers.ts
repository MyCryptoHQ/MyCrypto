import { CustomNodeConfig } from 'types/node';
import {
  TypeKeys,
  CustomNodeAction,
  AddCustomNodeAction,
  RemoveCustomNodeAction
} from '../../types';

export interface CustomNodesState {
  [customNodeId: string]: CustomNodeConfig;
}

const addCustomNode = (
  state: CustomNodesState,
  { payload }: AddCustomNodeAction
): CustomNodesState => ({
  ...state,
  [payload.id]: payload.config
});

function removeCustomNode(
  state: CustomNodesState,
  { payload }: RemoveCustomNodeAction
): CustomNodesState {
  const stateCopy = { ...state };
  Reflect.deleteProperty(stateCopy, payload.id);
  return stateCopy;
}

export default function customNodes(
  state: CustomNodesState = {},
  action: CustomNodeAction
): CustomNodesState {
  switch (action.type) {
    case TypeKeys.CONFIG_ADD_CUSTOM_NODE:
      return addCustomNode(state, action);
    case TypeKeys.CONFIG_REMOVE_CUSTOM_NODE:
      return removeCustomNode(state, action);
    default:
      return state;
  }
}
