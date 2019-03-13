export interface NetworkOptions {
  name: string;
  blockExplorer: string;
  tokenExplorer: string;
  chainId: number;
  contracts: string[];
  derivationPaths: string[];
  assets: string[];
  nodes: string[];
}

export interface ExtendedNetworkOptions extends NetworkOptions {
  uuid: string;
}
