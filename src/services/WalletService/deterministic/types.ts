import BigNumber from 'bignumber.js';
import { ValuesType } from 'utility-types';

import { DPath, ExtendedAsset, Network, TAddress, WalletId } from '@types';

import { Wallet } from '..';
import DeterministicWalletReducer from './reducer';

export interface TDWActionError {
  code: ValuesType<typeof DeterministicWalletReducer.errorCodes>;
  message: string;
}

export interface DWAccountDisplay {
  address: TAddress;
  pathItem: {
    baseDPath: DPath;
    path: string;
    index: number;
  };
  balance?: BigNumber;
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
  queuedAccounts: DWAccountDisplay[];
  finishedAccounts: DWAccountDisplay[];
  customDPaths: ExtendedDPath[];
  session: Wallet | undefined;
  promptConnectionRetry: boolean;
  completed: boolean;
  error?: TDWActionError;
}

export interface IUseDeterministicWallet {
  state: DeterministicWalletState;
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

export interface IDeterministicWalletService {
  init(props: HardwareInitProps): void;
  getAccounts(session: Wallet, dpath: ExtendedDPath[]): void;
  handleAccountsQueue(accounts: DWAccountDisplay[], network: Network, asset: ExtendedAsset): void;
  triggerComplete(): void;
}
