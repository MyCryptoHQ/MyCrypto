type StaticNetworkIds =
  | 'ETH'
  | 'Ropsten'
  | 'Kovan'
  | 'Rinkeby'
  | 'ETC'
  | 'UBQ'
  | 'EXP'
  | 'POA'
  | 'TOMO'
  | 'ELLA'
  | 'MUSIC'
  | 'ETSC'
  | 'EGEM'
  | 'CLO'
  | 'RSK_TESTNET'
  | 'GO'
  | 'EOSC';

export interface BlockExplorerConfig {
  name: string;
  origin: string;
  txUrl(txHash: string): string;
  addressUrl(address: string): string;
  blockUrl(blockNum: string | number): string;
}

interface Token {
  address: string;
  symbol: string;
  decimal: number;
  error?: string | null;
}

interface NetworkContract {
  name: StaticNetworkIds;
  address?: string;
  abi: string;
}

interface DPathFormats {
  trezor?: DPath;
  ledgerNanoS?: DPath;
  mnemonicPhrase: DPath;
}

export interface GasPriceSetting {
  min: number;
  max: number;
  initial: number;
}

interface StaticNetworkConfig {
  isCustom: false; // used for type guards
  id: StaticNetworkIds;
  name: string;
  unit: string;
  color?: string;
  blockExplorer: BlockExplorerConfig;
  tokenExplorer?: {
    name: string;
    address(address: string): string;
  };
  chainId: number;
  tokens: Token[];
  contracts: NetworkContract[] | null;
  dPathFormats: DPathFormats;
  isTestnet?: boolean;
  gasPriceSettings: GasPriceSetting;
  shouldEstimateGasPrice?: boolean;
}

interface CustomNetworkConfig {
  isCustom: true; // used for type guards
  isTestnet?: boolean;
  id: string;
  name: string;
  unit: string;
  chainId: number;
  dPathFormats: DPathFormats | null;
}

type NetworkConfig = CustomNetworkConfig | StaticNetworkConfig;
