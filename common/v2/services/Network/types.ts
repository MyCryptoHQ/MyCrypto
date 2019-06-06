import { GasPriceSetting, DPathFormats } from 'types/network';
import { StaticNetworkIds } from 'shared/types/network';

export interface Network {
  contracts: string[];
  baseAsset: string;
  assets: string[];
  nodes: NodeOptions[];
  id: string;
  name: string;
  chainId: number;
  isCustom: boolean;
  color: string | undefined;
  blockExplorer: {};
  tokenExplorer: {};
  tokens: {};
  dPathFormats: DPathFormats;
  gasPriceSettings: GasPriceSetting;
  shouldEstimateGasPrice: boolean | undefined;
}

export interface ExtendedNetwork extends Network {
  uuid: string;
}

export interface NodeOptions {
  name: string;
  type?: 'rpc' | 'etherscan' | 'infura' | 'web3' | 'myccustom';
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
  network: StaticNetworkIds;
  service: string;
  hidden?: boolean;
}
