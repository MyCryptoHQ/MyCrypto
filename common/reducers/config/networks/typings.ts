import { DPath } from 'config/dpaths';

export type DefaultNetworkNames = 'ETH' | 'Ropsten' | 'Kovan' | 'Rinkeby' | 'ETC' | 'UBQ' | 'EXP';

export interface BlockExplorerConfig {
  origin: string;
  txUrl(txHash: string): string;
  addressUrl(address: string): string;
}

export interface Token {
  address: string;
  symbol: string;
  decimal: number;
  error?: string | null;
}

export interface NetworkContract {
  name: DefaultNetworkNames;
  address?: string;
  abi: string;
}

export interface DPathFormats {
  trezor: DPath;
  ledgerNanoS: DPath;
  mnemonicPhrase: DPath;
}

export interface NetworkConfig {
  // TODO really try not to allow strings due to custom networks
  name: DefaultNetworkNames;
  unit: string;
  color?: string;
  blockExplorer?: BlockExplorerConfig;
  tokenExplorer?: {
    name: string;
    address(address: string): string;
  };
  chainId: number;
  tokens: Token[];
  contracts: NetworkContract[] | null;
  dPathFormats: DPathFormats;
  isTestnet?: boolean;
}

export interface CustomNetworkConfig {
  name: string;
  unit: string;
  chainId: number;
  dPathFormats: DPathFormats | null;
}
