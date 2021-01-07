// Used to be named RawNodeConfig in v1
export enum NodeType {
  RPC = 'rpc',
  ETHERSCAN = 'etherscan',
  INFURA = 'infura',
  POCKET = 'pocket',
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
  disableByDefault?: boolean;
}

export interface CustomNodeConfig extends NodeBase {
  isCustom: true;
  type: NodeType.MYC_CUSTOM;
  auth?: {
    username: string;
    password: string;
  };
}

export interface StaticNodeConfig extends NodeBase {
  isCustom?: false;
  type: NodeType.ETHERSCAN | NodeType.INFURA | NodeType.POCKET | NodeType.RPC | NodeType.WEB3;
}

export type NodeOptions = StaticNodeConfig | CustomNodeConfig;
