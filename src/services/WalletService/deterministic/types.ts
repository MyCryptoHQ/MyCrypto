import { ValuesType } from 'utility-types';

import { HDWalletErrors } from '@store/hdWallet.slice';
import { DPath, ExtendedAsset, Network, TAddress, WalletId } from '@types';

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

export interface ExtendedDPath extends DPath {
  offset: number;
  numOfAddresses: number;
}

export interface HDWalletState {
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
