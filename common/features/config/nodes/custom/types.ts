import { CustomNodeConfig } from 'types/node';

export interface CustomNodesState {
  [customNodeId: string]: CustomNodeConfig;
}

export enum CONFIG_NODES_CUSTOM {
  ADD = 'CONFIG_NODES_CUSTOM_ADD',
  REMOVE = 'CONFIG_NODES_CUSTOM_REMOVE'
}

export interface AddCustomNodeAction {
  type: CONFIG_NODES_CUSTOM.ADD;
  payload: CustomNodeConfig;
}

export interface RemoveCustomNodeAction {
  type: CONFIG_NODES_CUSTOM.REMOVE;
  payload: string;
}

export type CustomNodeAction = AddCustomNodeAction | RemoveCustomNodeAction;
