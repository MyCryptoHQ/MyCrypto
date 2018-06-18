export enum CONFIG_NODES_SELECTED {
  CHANGE_REQUESTED = 'CONFIG_NODES_SELECTED_CHANGE_REQUESTED',
  CHANGE_SUCCEEDED = 'CONFIG_NODES_SELECTED_CHANGE_SUCCEEDED',
  CHANGE_FAILED = 'CONFIG_NODES_SELECTED_CHANGE_FAILED',
  CHANGE_REQUESTED_ONETIME = 'CONFIG_NODES_SELECTED_CHANGE_REQUESTED_ONETIME',
  CHANGE_FORCE = 'CONFIG_NODES_SELECTED_CHANGE_FORCE'
}

export interface ChangeNodeRequestedAction {
  type: CONFIG_NODES_SELECTED.CHANGE_REQUESTED;
  payload: string;
}

export interface ChangeNodeSucceededAction {
  type: CONFIG_NODES_SELECTED.CHANGE_SUCCEEDED;
  payload: {
    nodeId: string;
    networkId: string;
  };
}

export interface ChangeNodeFailedAction {
  type: CONFIG_NODES_SELECTED.CHANGE_FAILED;
}

export interface ChangeNodeRequestedOneTimeAction {
  type: CONFIG_NODES_SELECTED.CHANGE_REQUESTED_ONETIME;
  payload: string;
}

export interface ChangeNodeForceAction {
  type: CONFIG_NODES_SELECTED.CHANGE_FORCE;
  payload: string;
}

export type SelectedNodeAction =
  | ChangeNodeRequestedAction
  | ChangeNodeSucceededAction
  | ChangeNodeFailedAction
  | ChangeNodeRequestedOneTimeAction
  | ChangeNodeForceAction;

export interface NodeLoaded {
  pending: false;
  prevNode: string;
  nodeId: string;
}

export interface NodeChangePending {
  pending: true;
  prevNode: string;
  nodeId: string;
}

export type SelectedNodeState = NodeLoaded | NodeChangePending;
