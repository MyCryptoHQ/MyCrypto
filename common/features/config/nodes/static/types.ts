import { StaticNodeConfig, StaticNodeConfigs } from 'types/node';

export type ConfigStaticNodesState = StaticNodeConfigs;

export enum ConfigStaticNodesActions {
  WEB3_SET = 'CONFIG_NODES_STATIC_WEB3_SET',
  WEB3_UNSET = 'CONFIG_NODES_STATIC_WEB3_UNSET'
}

export interface Web3setNodeAction {
  type: ConfigStaticNodesActions.WEB3_SET;
  payload: { id: 'web3'; config: StaticNodeConfig };
}

export interface Web3UnsetNodeAction {
  type: ConfigStaticNodesActions.WEB3_UNSET;
}

export type StaticNodeAction = Web3setNodeAction | Web3UnsetNodeAction;
