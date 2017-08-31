// @flow
import type Big from 'bignumber.js';

export type TokenValues = { [string]: ?Big };

export type DeterministicWalletData = {
  index: number,
  address: string,
  value?: Big,
  tokenValues: TokenValues
};

/*** Get determinstic wallets ***/
export type GetDeterministicWalletsAction = {
  type: 'DW_GET_WALLETS',
  payload: {
    dPath: string,
    publicKey: string,
    chainCode: string,
    limit: number,
    offset: number
  }
};

export type GetDeterministicWalletsArgs = {
  dPath: string,
  publicKey: string,
  chainCode: string,
  limit?: number,
  offset?: number
};

export function getDeterministicWallets(
  args: GetDeterministicWalletsArgs
): GetDeterministicWalletsAction {
  const { dPath, publicKey, chainCode, limit, offset } = args;
  return {
    type: 'DW_GET_WALLETS',
    payload: {
      dPath,
      publicKey,
      chainCode,
      limit: limit || 5,
      offset: offset || 0
    }
  };
}

/*** Set deterministic wallets ***/
export type SetDeterministicWalletsAction = {
  type: 'DW_SET_WALLETS',
  payload: DeterministicWalletData[]
};

export function setDeterministicWallets(
  wallets: DeterministicWalletData[]
): SetDeterministicWalletsAction {
  return {
    type: 'DW_SET_WALLETS',
    payload: wallets
  };
}

/*** Set desired token ***/
export type SetDesiredTokenAction = {
  type: 'DW_SET_DESIRED_TOKEN',
  payload: ?string
};

export function setDesiredToken(token: ?string): SetDesiredTokenAction {
  return {
    type: 'DW_SET_DESIRED_TOKEN',
    payload: token
  };
}

/*** Set wallet values ***/
export type UpdateDeterministicWalletArgs = {
  address: string,
  value: ?Big,
  tokenValues: ?TokenValues
};

export type UpdateDeterministicWalletAction = {
  type: 'DW_UPDATE_WALLET',
  payload: UpdateDeterministicWalletArgs
};

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
  | SetDesiredTokenAction;
