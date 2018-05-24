import { AddCustomNodeAction, RemoveCustomNodeAction, CONFIG_NODES_CUSTOM } from './types';

export type TAddCustomNode = typeof addCustomNode;
export function addCustomNode(payload: AddCustomNodeAction['payload']): AddCustomNodeAction {
  return {
    type: CONFIG_NODES_CUSTOM.ADD,
    payload
  };
}

export type TRemoveCustomNode = typeof removeCustomNode;
export function removeCustomNode(
  payload: RemoveCustomNodeAction['payload']
): RemoveCustomNodeAction {
  return {
    type: CONFIG_NODES_CUSTOM.REMOVE,
    payload
  };
}
