import * as types from './types';

export type TAddCustomNode = typeof addCustomNode;
export function addCustomNode(
  payload: types.AddCustomNodeAction['payload']
): types.AddCustomNodeAction {
  return {
    type: types.ConfigNodesCustomActions.ADD,
    payload
  };
}

export type TRemoveCustomNode = typeof removeCustomNode;
export function removeCustomNode(
  payload: types.RemoveCustomNodeAction['payload']
): types.RemoveCustomNodeAction {
  return {
    type: types.ConfigNodesCustomActions.REMOVE,
    payload
  };
}
