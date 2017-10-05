import { BigNumber } from 'bignumber.js';

export interface TokenValues {
  [key: string]: BigNumber;
}

export interface DeterministicWalletData {
  index: number;
  address: string;
  value?: BigNumber;
  tokenValues: TokenValues;
}

/*** Get determinstic wallets ***/
export interface GetDeterministicWalletsAction {
  type: 'DW_GET_WALLETS';
  payload: {
    seed?: string;
    dPath: string;
    publicKey?: string;
    chainCode?: string;
    limit: number;
    offset: number;
  };
}

/*** Set deterministic wallets ***/
export interface SetDeterministicWalletsAction {
  type: 'DW_SET_WALLETS';
  payload: DeterministicWalletData[];
}

/*** Set desired token ***/
export interface SetDesiredTokenAction {
  type: 'DW_SET_DESIRED_TOKEN';
  payload: string | undefined;
}

/*** Set wallet values ***/
export interface UpdateDeterministicWalletArgs {
  address: string;
  value?: BigNumber;
  tokenValues?: TokenValues;
  index?: any;
}

export interface UpdateDeterministicWalletAction {
  type: 'DW_UPDATE_WALLET';
  payload: UpdateDeterministicWalletArgs;
}

export interface GetDeterministicWalletsArgs {
  seed?: string;
  dPath: string;
  publicKey?: string;
  chainCode?: string;
  limit?: number;
  offset?: number;
}

/*** Union Type ***/
export type DeterministicWalletAction =
  | SetDeterministicWalletsAction
  | GetDeterministicWalletsAction
  | UpdateDeterministicWalletAction
  | SetDesiredTokenAction;
