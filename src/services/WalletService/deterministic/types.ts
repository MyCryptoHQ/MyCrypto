import BigNumber from 'bignumber.js';
import { ValuesType } from 'utility-types';

import { TAddress, DPathFormat, Network, ExtendedAsset, ExtendedAddressBook } from '@types';

import DeterministicWalletReducer from './reducer';
import { Wallet } from '..';

export type TDWActionError = ValuesType<typeof DeterministicWalletReducer.errorCodes>;

export interface DWAccountDisplay {
  address: TAddress;
  pathItem: {
    baseDPath: DPath;
    path: string;
    index: number;
  };
  balance: BigNumber | undefined;
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
  errors: TDWActionError[];
}

export interface IUseDeterministicWallet {
  state: DeterministicWalletState;
  requestConnection(
    network: Network,
    asset: ExtendedAsset,
    mnemonicPhrase?: string,
    pass?: string
  ): void;
  updateAsset(asset: ExtendedAsset): void;
  addDPaths(dpaths: ExtendedDPath[]): void;
  generateFreshAddress(defaultDPath: ExtendedDPath): boolean;
}

export interface IDeterministicWalletService {
  init(walletId: DPathFormat, asset: ExtendedAsset, phrase: string, pass: string): void;
  getAccounts(session: Wallet, dpath: ExtendedDPath[]): void;
  handleAccountsQueue(accounts: DWAccountDisplay[], network: Network, asset: ExtendedAsset): void;
  triggerComplete(): void;
}
