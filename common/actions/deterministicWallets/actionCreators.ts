import * as interfaces from './actionTypes';
import { TypeKeys } from './constants';
export function getDeterministicWallets(
  args: interfaces.GetDeterministicWalletsArgs
): interfaces.GetDeterministicWalletsAction {
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
  wallets: interfaces.DeterministicWalletData[]
): interfaces.SetDeterministicWalletsAction {
  return {
    type: TypeKeys.DW_SET_WALLETS,
    payload: wallets
  };
}

export function setDesiredToken(token: string | undefined): interfaces.SetDesiredTokenAction {
  return {
    type: TypeKeys.DW_SET_DESIRED_TOKEN,
    payload: token
  };
}

export function updateDeterministicWallet(
  args: interfaces.UpdateDeterministicWalletArgs
): interfaces.UpdateDeterministicWalletAction {
  return {
    type: TypeKeys.DW_UPDATE_WALLET,
    payload: args
  };
}
