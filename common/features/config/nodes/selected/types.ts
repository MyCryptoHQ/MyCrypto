export enum CONFIG_NODES_SELECTED {
  CHANGE = 'CONFIG_NODED_SELECTED_CHANGE',
  CHANGE_INTENT = 'CONFIG_NODED_SELECTED_CHANGE_INTENT'
}

export interface ChangeNodeAction {
  type: CONFIG_NODES_SELECTED.CHANGE;
  payload: {
    nodeId: string;
    networkId: string;
  };
}

export interface ChangeNodeIntentAction {
  type: CONFIG_NODES_SELECTED.CHANGE_INTENT;
  payload: string;
}

export type SelectedNodeAction = ChangeNodeAction | ChangeNodeIntentAction;

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
