import {
  TypeKeys,
  GetDeterministicWalletsArgs,
  GetDeterministicWalletsAction,
  DeterministicWalletData,
  SetDeterministicWalletsAction,
  SetDesiredTokenAction,
  UpdateDeterministicWalletArgs,
  UpdateDeterministicWalletAction
} from './types';

export function getDeterministicWallets(
  args: GetDeterministicWalletsArgs
): GetDeterministicWalletsAction {
  const { seed, dPath, publicKey, chainCode, limit, offset } = args;
  return {
    type: TypeKeys.DW_GET_WALLETS,
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
  wallets: DeterministicWalletData[]
): SetDeterministicWalletsAction {
  return {
    type: TypeKeys.DW_SET_WALLETS,
    payload: wallets
  };
}

export function setDesiredToken(token: string | undefined): SetDesiredTokenAction {
  return {
    type: TypeKeys.DW_SET_DESIRED_TOKEN,
    payload: token
  };
}

export function updateDeterministicWallet(
  args: UpdateDeterministicWalletArgs
): UpdateDeterministicWalletAction {
  return {
    type: TypeKeys.DW_UPDATE_WALLET,
    payload: args
  };
}

export default {
  getDeterministicWallets,
  setDeterministicWallets,
  setDesiredToken,
  updateDeterministicWallet
};
