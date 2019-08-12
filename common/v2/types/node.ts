// Used to be named RawNodeConfig in v1
export interface NodeConfig {
  name: string;
  type: 'rpc' | 'etherscan' | 'infura' | 'web3' | 'myccustom';
  service: string;
  url: string;
}
