import { StaticNetworkIds, BlockExplorerConfig } from 'shared/types/network';
import { SecureWalletName, InsecureWalletName } from './wallet';

export interface Network {
  id: string;
  name: string;
  baseAsset: string;
  chainId: number;
  isCustom: boolean;
  color: string | undefined;
  blockExplorer?: BlockExplorerConfig;
  tokenExplorer?: {
    name: string;
    address(address: string): string;
  };
  assets: string[];
  contracts: string[];
  dPaths: DPathFormats;
  gasPriceSettings: GasPriceSetting;
  shouldEstimateGasPrice?: boolean;
  nodes: NodeOptions[];
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

export interface DerivationPathOptions {
  name: string;
  derivationPath: string;
  active: boolean;
}

export interface ExtendedDerivationPathOptions extends DerivationPathOptions {
  uuid: string;
}

export interface DPathFormats {
  default?: DPath;
  trezor?: DPath;
  safeTmini?: DPath;
  ledgerNanoS?: DPath;
  mnemonicPhrase: DPath;
}

export interface DPath {
  label: string;
  value: string; // TODO determine method for more precise typing for path
}

export interface GasPriceSetting {
  min: number;
  max: number;
  initial: number;
}

export type DPathFormat =
  | SecureWalletName.TREZOR
  | SecureWalletName.SAFE_T
  | SecureWalletName.LEDGER_NANO_S
  | InsecureWalletName.MNEMONIC_PHRASE;
