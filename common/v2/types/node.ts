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
