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

interface NodeBase {
  isCustom?: boolean;
  name: string;
  type: NodeType;
  service: string;
  url: string;
  hidden?: boolean;
}

export interface CustomNodeConfig extends NodeBase {
  isCustom?: true;
  service: string;
  type: NodeType.MYC_CUSTOM;
  auth?: {
    username: string;
    password: string;
  };
}

export interface StaticNodeConfig extends NodeBase {
  isCustom?: false;
  service: string;
  type: NodeType.ETHERSCAN | NodeType.INFURA | NodeType.RPC | NodeType.WEB3;
}

export type NodeOptions = StaticNodeConfig | CustomNodeConfig;
