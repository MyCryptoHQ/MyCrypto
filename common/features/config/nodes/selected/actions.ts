import {
  ChangeNodeRequestedAction,
  ChangeNodeSucceededAction,
  ChangeNodeFailedAction,
  ChangeNodeRequestedOneTimeAction,
  ChangeNodeForceAction,
  CONFIG_NODES_SELECTED
} from './types';

export type TChangeNodeRequested = typeof changeNodeRequested;
export function changeNodeRequested(payload: string): ChangeNodeRequestedAction {
  return {
    type: CONFIG_NODES_SELECTED.CHANGE_REQUESTED,
    payload
  };
}

export type TChangeNodeSucceeded = typeof changeNodeSucceeded;
export function changeNodeSucceeded(
  payload: ChangeNodeSucceededAction['payload']
): ChangeNodeSucceededAction {
  return {
    type: CONFIG_NODES_SELECTED.CHANGE_SUCCEEDED,
    payload
  };
}

export type TChangeNodeFailed = typeof changeNodeFailed;
export function changeNodeFailed(): ChangeNodeFailedAction {
  return {
    type: CONFIG_NODES_SELECTED.CHANGE_FAILED
  };
}

export type TChangeNodeRequestedOneTime = typeof changeNodeRequestedOneTime;
export function changeNodeRequestedOneTime(payload: string): ChangeNodeRequestedOneTimeAction {
  return {
    type: CONFIG_NODES_SELECTED.CHANGE_REQUESTED_ONETIME,
    payload
  };
}

export type TChangeNodeForce = typeof changeNodeForce;
export function changeNodeForce(payload: string): ChangeNodeForceAction {
  return {
    type: CONFIG_NODES_SELECTED.CHANGE_FORCE,
    payload
  };
}
