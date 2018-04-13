// Moving state types into their own file resolves an annoying webpack bug
// https://github.com/angular/angular-cli/issues/2034
import { StaticNodeConfigs, CustomNodeConfig } from 'types/node';

export interface CustomNodesState {
  [customNodeId: string]: CustomNodeConfig;
}

interface NodeLoaded {
  pending: false;
  prevNode: string;
  nodeId: string;
}

interface NodeChangePending {
  pending: true;
  prevNode: string;
  nodeId: string;
}

export type SelectedNodeState = NodeLoaded | NodeChangePending;

export type StaticNodesState = StaticNodeConfigs;
