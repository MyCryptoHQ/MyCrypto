import BigNumber from 'bignumber.js';
import { ValuesType } from 'utility-types';

import { TAddress, DPathFormat, Network, ExtendedAsset } from '@types';

import DeterministicWalletReducer from './reducer';
import { Wallet } from '..';

export type TActionError = ValuesType<typeof DeterministicWalletReducer.errorCodes>;

export interface DWAccountDisplay {
  address: TAddress;
  pathItem: {
    baseDPath: DPath;
    path: string;
    index: number;
  };
  balance: BigNumber | undefined;
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
  session: Wallet | undefined;
  promptConnectionRetry: boolean;
  errors: TActionError[];
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
}

export interface IDeterministicWalletService {
  init(walletId: DPathFormat, asset: ExtendedAsset, phrase: string, pass: string): void;
  getAccounts(session: Wallet, dpath: ExtendedDPath[]): void;
  handleAccountsQueue(accounts: DWAccountDisplay[], network: Network, asset: ExtendedAsset): void;
}
