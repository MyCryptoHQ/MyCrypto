import { CustomNodeConfig } from 'types/node';

export interface ConfigCustomNodesState {
  [customNodeId: string]: CustomNodeConfig;
}

export enum ConfigNodesCustomActions {
  ADD = 'CONFIG_NODES_CUSTOM_ADD',
  REMOVE = 'CONFIG_NODES_CUSTOM_REMOVE'
}

export interface AddCustomNodeAction {
  type: ConfigNodesCustomActions.ADD;
  payload: CustomNodeConfig;
}

export interface RemoveCustomNodeAction {
  type: ConfigNodesCustomActions.REMOVE;
  payload: string;
}

export type CustomNodeAction = AddCustomNodeAction | RemoveCustomNodeAction;
