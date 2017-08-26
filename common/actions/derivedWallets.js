// @flow
import type Big from 'bignumber.js';

export type TokenValues = { [string]: ?Big };

export type DerivedWallet = {
  index: number,
  address: string,
  value?: Big,
  tokenValues: TokenValues
};

/*** Get derived wallets ***/
export type GetDerivedWalletsAction = {
  type: 'DERIVED_WALLETS_GET_WALLETS',
  payload: {
    dPath: string,
    publicKey: string,
    chainCode: string,
    limit: number,
    offset: number
  }
};

export type GetDerivedWalletsArgs = {
  dPath: string,
  publicKey: string,
  chainCode: string,
  limit?: number,
  offset?: number
};

export function getDerivedWallets(
  args: GetDerivedWalletsArgs
): GetDerivedWalletsAction {
  const { dPath, publicKey, chainCode, limit, offset } = args;
  return {
    type: 'DERIVED_WALLETS_GET_WALLETS',
    payload: {
      dPath,
      publicKey,
      chainCode,
      limit: limit || 5,
      offset: offset || 0
    }
  };
}

/*** Set derived wallets ***/
export type SetDerivedWalletsAction = {
  type: 'DERIVED_WALLETS_SET_WALLETS',
  payload: DerivedWallet[]
};

export function setDerivedWallets(
  wallets: DerivedWallet[]
): SetDerivedWalletsAction {
  return {
    type: 'DERIVED_WALLETS_SET_WALLETS',
    payload: wallets
  };
}

/*** Set desired token ***/
export type SetDesiredTokenAction = {
  type: 'DERIVED_WALLETS_SET_DESIRED_TOKEN',
  payload: ?string
};

export function setDesiredToken(token: ?string): SetDesiredTokenAction {
  return {
    type: 'DERIVED_WALLETS_SET_DESIRED_TOKEN',
    payload: token
  };
}

/*** Set wallet values ***/
export type UpdateDerivedWalletArgs = {
  address: string,
  value: ?Big,
  tokenValues: ?TokenValues
};

export type UpdateDerivedWalletAction = {
  type: 'DERIVED_WALLETS_UPDATE_WALLET',
  payload: UpdateDerivedWalletArgs
};

export function updateDerivedWallet(
  args: UpdateDerivedWalletArgs
): UpdateDerivedWalletAction {
  return {
    type: 'DERIVED_WALLETS_UPDATE_WALLET',
    payload: args
  };
}

/*** Union Type ***/
export type DerivedWalletAction =
  | GetDerivedWalletsAction
  | UpdateDerivedWalletAction
  | SetDesiredTokenAction;
