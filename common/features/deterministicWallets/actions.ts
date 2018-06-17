import * as types from './types';

export function getDeterministicWallets(
  args: types.GetDeterministicWalletsArgs
): types.GetDeterministicWalletsAction {
  const { seed, dPath, publicKey, chainCode, limit, offset } = args;
  return {
    type: types.DeterministicWalletsActions.GET,
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

export function setDeterministicWallets(
  wallets: types.DeterministicWalletData[]
): types.SetDeterministicWalletsAction {
  return {
    type: types.DeterministicWalletsActions.SET,
    payload: wallets
  };
}

export function setDesiredToken(token: string | undefined): types.SetDesiredTokenAction {
  return {
    type: types.DeterministicWalletsActions.SET_DESIRED_TOKEN,
    payload: token
  };
}

export function updateDeterministicWallet(
  args: types.UpdateDeterministicWalletArgs
): types.UpdateDeterministicWalletAction {
  return {
    type: types.DeterministicWalletsActions.UPDATE_WALLET,
    payload: args
  };
}
