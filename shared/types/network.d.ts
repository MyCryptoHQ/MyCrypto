import { TAB } from 'components/Header/components/constants';

type StaticNetworkIds =
  | 'ETH'
  | 'Ropsten'
  | 'Kovan'
  | 'Rinkeby'
  | 'Goerli'
  | 'ETC'
  | 'RSK'
  | 'AKA'
  | 'AQUA'
  | 'ARTIS_SIGMA1'
  | 'ARTIS_TAU1'
  | 'ATH'
  | 'CLO'
  | 'DEXON'
  | 'EGEM'
  | 'ELLA'
  | 'EOSC'
  | 'ESN'
  | 'ETHO'
  | 'ETSC'
  | 'EXP'
  | 'Gangnam'
  | 'GO'
  | 'GO_TESTNET'
  | 'METADIUM'
  | 'MIX'
  | 'MUSIC'
  | 'PIRL'
  | 'POA'
  | 'REOSC'
  | 'RSK_TESTNET'
  | 'SOLIDUM'
  | 'THUNDERCORE'
  | 'TOMO'
  | 'UBQ'
  | 'WEB'
  | 'ASK';

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
  safeTmini?: DPath;
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
  unsupportedTabs?: TAB[];
  hideEquivalentValues?: boolean;
}

interface CustomNetworkConfig {
  isCustom: true; // used for type guards
  isTestnet?: boolean;
  id: string;
  name: string;
  unit: string;
  chainId: number;
  dPathFormats: DPathFormats | null;
  unsupportedTabs?: TAB[];
  hideEquivalentValues?: boolean;
}

type NetworkConfig = CustomNetworkConfig | StaticNetworkConfig;
