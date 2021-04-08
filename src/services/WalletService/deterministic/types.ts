import { ValuesType } from 'utility-types';

import { HDWalletErrors } from '@store/hdWallet.slice';
import { DPath, ExtendedAsset, Network, TAddress, WalletId } from '@types';

import { Wallet } from '..';

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

export interface DeterministicWalletState {
  isInit: boolean;
  isConnected: boolean;
  isConnecting: boolean;
  isGettingAccounts: boolean;
  detectedChainId?: number | undefined;
  asset?: ExtendedAsset;
  network?: Network;
  queuedAccounts: DWAccountDisplay[];
  finishedAccounts: DWAccountDisplay[];
  customDPaths: ExtendedDPath[];
  session: Wallet | undefined;
  isCompleted: boolean;
  error?: TDWActionError;
}

export interface IUseDeterministicWallet {
  connectionError?: TDWActionError;
  selectedAsset?: ExtendedAsset;
  isCompleted: boolean;
  isConnected: boolean;
  isConnecting: boolean;
  queuedAccounts: DWAccountDisplay[];
  finishedAccounts: DWAccountDisplay[];
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
