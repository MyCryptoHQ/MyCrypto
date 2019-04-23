import { GasPriceSetting } from 'types/network';

export interface NetworkOptions {
  contracts: string[];
  assets?: string[];
  nodes: string[];
  id: string;
  name: string;
  unit: string;
  chainId: number;
  isCustom: boolean;
  color: string | undefined;
  blockExplorer: {};
  tokenExplorer: {};
  tokens: {};
  dPathFormats: {};
  gasPriceSettings: GasPriceSetting;
  shouldEstimateGasPrice: boolean | undefined;
}

export interface ExtendedNetworkOptions extends NetworkOptions {
  uuid: string;
}
