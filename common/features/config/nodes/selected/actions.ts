import * as types from './types';

export type TChangeNodeRequested = typeof changeNodeRequested;
export function changeNodeRequested(payload: string): types.ChangeNodeRequestedAction {
  return {
    type: types.ConfigNodesSelectedActions.CHANGE_REQUESTED,
    payload
  };
}

export type TChangeNodeSucceeded = typeof changeNodeSucceeded;
export function changeNodeSucceeded(
  payload: types.ChangeNodeSucceededAction['payload']
): types.ChangeNodeSucceededAction {
  return {
    type: types.ConfigNodesSelectedActions.CHANGE_SUCCEEDED,
    payload
  };
}

export type TChangeNodeFailed = typeof changeNodeFailed;
export function changeNodeFailed(): types.ChangeNodeFailedAction {
  return {
    type: types.ConfigNodesSelectedActions.CHANGE_FAILED
  };
}

export type TChangeNodeRequestedOneTime = typeof changeNodeRequestedOneTime;
export function changeNodeRequestedOneTime(
  payload: string
): types.ChangeNodeRequestedOneTimeAction {
  return {
    type: types.ConfigNodesSelectedActions.CHANGE_REQUESTED_ONETIME,
    payload
  };
}

export type TChangeNodeForce = typeof changeNodeForce;
export function changeNodeForce(payload: string): types.ChangeNodeForceAction {
  return {
    type: types.ConfigNodesSelectedActions.CHANGE_FORCE,
    payload
  };
}
