import { NetworkId } from './networkId';

// Used to be named RawNodeConfig in v1
export enum NodeType {
  RPC = 'rpc',
  ETHERSCAN = 'etherscan',
  INFURA = 'infura',
  WEB3 = 'web3',
  MYC_CUSTOM = 'myccustom'
}

export interface NodeConfig {
  name: string;
  type: NodeType;
  service: string;
  url: string;
}

export interface NodeOptions {
  name: string;
  type: NodeType;
  service: string;
  url: string;
  isCustom?: boolean;
  isAuto?: boolean;
  network?: string;
  hidden?: boolean;
}

export interface ExtendedNodeOptions extends NodeOptions {
  uuid: string;
}

export interface CustomNodeConfig {
  id: string;
  isCustom: true;
  isAuto?: undefined;
  name: string;
  service: 'your custom node';
  url: string;
  network: string;
  auth?: {
    username: string;
    password: string;
  };
}

export interface StaticNodeConfig {
  id: string;
  isCustom: false;
  isAuto?: boolean;
  network: NetworkId;
  service: string;
  hidden?: boolean;
}
