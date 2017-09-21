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

export interface GetDeterministicWalletsArgs {
  seed?: string;
  dPath: string;
  publicKey?: string;
  chainCode?: string;
  limit?: number;
  offset?: number;
}

export function getDeterministicWallets(
  args: GetDeterministicWalletsArgs
): GetDeterministicWalletsAction {
  const { seed, dPath, publicKey, chainCode, limit, offset } = args;
  return {
    type: 'DW_GET_WALLETS',
    payload: {
      seed,
      dPath,
      publicKey,
      chainCode,
      limit: limit || 5,
      offset: offset || 0
    }
  };
}

/*** Set deterministic wallets ***/
export interface SetDeterministicWalletsAction {
  type: 'DW_SET_WALLETS';
  payload: DeterministicWalletData[];
}

export function setDeterministicWallets(
  wallets: DeterministicWalletData[]
): SetDeterministicWalletsAction {
  return {
    type: 'DW_SET_WALLETS',
    payload: wallets
  };
}

/*** Set desired token ***/
export interface SetDesiredTokenAction {
  type: 'DW_SET_DESIRED_TOKEN';
  payload: string;
}

export function setDesiredToken(token: string): SetDesiredTokenAction {
  return {
    type: 'DW_SET_DESIRED_TOKEN',
    payload: token
  };
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

export function updateDeterministicWallet(
  args: UpdateDeterministicWalletArgs
): UpdateDeterministicWalletAction {
  return {
    type: 'DW_UPDATE_WALLET',
    payload: args
  };
}

/*** Union Type ***/
export type DeterministicWalletAction =
  | GetDeterministicWalletsAction
  | UpdateDeterministicWalletAction
  | SetDesiredTokenAction
  | SetDeterministicWalletsAction;
