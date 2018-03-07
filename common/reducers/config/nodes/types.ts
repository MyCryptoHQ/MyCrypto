// Moving state types into their own file resolves an annoying webpack bug
// https://github.com/angular/angular-cli/issues/2034
import { NonWeb3NodeConfigs, Web3NodeConfigs, CustomNodeConfig } from 'types/node';

export interface CustomNodesState {
  [customNodeId: string]: CustomNodeConfig;
}

interface NodeLoaded {
  pending: false;
  nodeId: string;
}

interface NodeChangePending {
  pending: true;
  nodeId: string;
}

export type SelectedNodeState = NodeLoaded | NodeChangePending;

export type StaticNodesState = NonWeb3NodeConfigs & Web3NodeConfigs;
