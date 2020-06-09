import BigNumber from 'bignumber.js';
import { ValuesType } from 'utility-types';

import { TAddress, DPathFormat, Network } from '@types';

import DeterministicWalletReducer from './reducer';
import { Wallet } from '..';

export type TActionError = ValuesType<typeof DeterministicWalletReducer.errorCodes>;

export interface DWAccountDisplay {
  address: TAddress;
  path: string;
  balance: BigNumber | undefined;
}

export interface DeterministicWalletState {
  isInit: boolean;
  isConnected: boolean;
  isConnecting: boolean;
  isGettingAccounts: boolean;
  detectedChainId?: number | undefined;
  accounts: DWAccountDisplay[];
  session: Wallet | undefined;
  promptConnectionRetry: boolean;
  errors: TActionError[];
}

export interface IUseDeterministicWallet {
  state: DeterministicWalletState;
  requestConnection(): void;
}

export interface IDeterministicWalletService {
  init(network: Network, walletId: DPathFormat): void;
  //connect(network: Network, walletId: DPathFormat): void;
  getAccounts(
    session: Wallet,
    dpath: DPath,
    numOfAddresses: number,
    offset: number,
    network: Network
  ): void;
  //getAllAccounts(dpaths: DPath[], numOfAddresses: number): void;
}
