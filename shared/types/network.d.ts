import { StaticNetworksState, CustomNetworksState } from 'reducers/config/networks';

type StaticNetworkNames = 'ETH' | 'Ropsten' | 'Kovan' | 'Rinkeby' | 'ETC' | 'UBQ' | 'EXP';

interface BlockExplorerConfig {
  origin: string;
  txUrl(txHash: string): string;
  addressUrl(address: string): string;
}

interface Token {
  address: string;
  symbol: string;
  decimal: number;
  error?: string | null;
}

interface NetworkContract {
  name: StaticNetworkNames;
  address?: string;
  abi: string;
}

interface DPathFormats {
  trezor: DPath;
  ledgerNanoS: DPath;
  mnemonicPhrase: DPath;
}

interface StaticNetworkConfig {
  // TODO really try not to allow strings due to custom networks
  isCustom: false; // used for type guards
  name: StaticNetworkNames;
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

interface CustomNetworkConfig {
  isCustom: true; // used for type guards
  isTestnet?: boolean;
  name: string;
  unit: string;
  chainId: number;
  dPathFormats: DPathFormats | null;
}

type NetworkConfig = StaticNetworksState[StaticNetworkNames] | CustomNetworksState[string];
