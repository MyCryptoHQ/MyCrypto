import { ChangeNodeAction, ChangeNodeIntentAction, CONFIG_NODES_SELECTED } from './types';

export type TChangeNode = typeof changeNode;
export function changeNode(payload: ChangeNodeAction['payload']): ChangeNodeAction {
  return {
    type: CONFIG_NODES_SELECTED.CHANGE,
    payload
  };
}

export type TChangeNodeIntent = typeof changeNodeIntent;
export function changeNodeIntent(payload: string): ChangeNodeIntentAction {
  return {
    type: CONFIG_NODES_SELECTED.CHANGE_INTENT,
    payload
  };
}
