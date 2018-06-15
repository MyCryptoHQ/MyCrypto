import * as deterministicWalletsTypes from './types';

export function getDeterministicWallets(
  args: deterministicWalletsTypes.GetDeterministicWalletsArgs
): deterministicWalletsTypes.GetDeterministicWalletsAction {
  const { seed, dPath, publicKey, chainCode, limit, offset } = args;
  return {
    type: deterministicWalletsTypes.DeterministicWalletsActions.GET,
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
  wallets: deterministicWalletsTypes.DeterministicWalletData[]
): deterministicWalletsTypes.SetDeterministicWalletsAction {
  return {
    type: deterministicWalletsTypes.DeterministicWalletsActions.SET,
    payload: wallets
  };
}

export function setDesiredToken(
  token: string | undefined
): deterministicWalletsTypes.SetDesiredTokenAction {
  return {
    type: deterministicWalletsTypes.DeterministicWalletsActions.SET_DESIRED_TOKEN,
    payload: token
  };
}

export function updateDeterministicWallet(
  args: deterministicWalletsTypes.UpdateDeterministicWalletArgs
): deterministicWalletsTypes.UpdateDeterministicWalletAction {
  return {
    type: deterministicWalletsTypes.DeterministicWalletsActions.UPDATE_WALLET,
    payload: args
  };
}
