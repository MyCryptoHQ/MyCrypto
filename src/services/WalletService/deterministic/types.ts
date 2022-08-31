import { DeterministicWallet, DerivationPath as DPath } from '@mycrypto/wallets';
import { ValuesType } from 'utility-types';

import { HDWalletErrors } from '@features/AddAccount/components/hdWallet.slice';
import { ExtendedAsset, Network, TAddress, WalletId } from '@types';

export interface TDWActionError {
  code: ValuesType<typeof HDWalletErrors>;
  message: string;
}

export interface DWAccountDisplay {
  address: TAddress;
  pathItem: {
    baseDPath: ExtendedDPath;
    path: string;
    index: number;
  };
  balance?: string;
  isFreshAddress?: boolean;
}

export type ExtendedDPath = DPath & {
  offset: number;
  numOfAddresses: number;
};

export interface HDWalletState {
  session?: DeterministicWallet;
  isInit: boolean;
  isConnected: boolean;
  isConnecting: boolean;
  isGettingAccounts: boolean;
  asset?: ExtendedAsset;
  network?: Network;
  accountQueue: DWAccountDisplay[];
  scannedAccounts: DWAccountDisplay[];
  customDPaths: ExtendedDPath[];
  isCompleted: boolean;
  error?: TDWActionError;
}

export interface IUseHDWallet {
  connectionError?: TDWActionError;
  selectedAsset?: ExtendedAsset;
  isCompleted: boolean;
  isConnected: boolean;
  isConnecting: boolean;
  accountQueue: DWAccountDisplay[];
  scannedAccounts: DWAccountDisplay[];
  mergedDPaths: ExtendedDPath[];
  requestConnection(network: Network, asset: ExtendedAsset): void;
  updateAsset(asset: ExtendedAsset): void;
  addDPaths(dpaths: ExtendedDPath[]): void;
  scanMoreAddresses(dpath: ExtendedDPath): void;
}

export interface HardwareInitProps {
  walletId: WalletId;
  asset: ExtendedAsset;
  dpath: DPath;
}
