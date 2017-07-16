// @flow
import BaseWallet from 'libs/wallet/base';
import Big from 'big.js';

export type PrivateKeyUnlockParams = {
  key: string,
  password: string
};

export type UnlockPrivateKeyAction = {
  type: 'WALLET_UNLOCK_PRIVATE_KEY',
  payload: PrivateKeyUnlockParams
};

export type SetWalletAction = {
  type: 'WALLET_SET',
  payload: BaseWallet
};

export type SetBalanceAction = {
  type: 'WALLET_SET_BALANCE',
  payload: Big
};

export type SetTokenBalancesAction = {
  type: 'WALLET_SET_TOKEN_BALANCES',
  payload: {
    [string]: Big
  }
};

export type WalletAction =
  | UnlockPrivateKeyAction
  | SetWalletAction
  | SetBalanceAction
  | SetTokenBalancesAction;

export function unlockPrivateKey(
  value: PrivateKeyUnlockParams
): UnlockPrivateKeyAction {
  return {
    type: 'WALLET_UNLOCK_PRIVATE_KEY',
    payload: value
  };
}

export function setWallet(value: BaseWallet): SetWalletAction {
  return {
    type: 'WALLET_SET',
    payload: value
  };
}

export function setBalance(value: Big): SetBalanceAction {
  return {
    type: 'WALLET_SET_BALANCE',
    payload: value
  };
}

export function setTokenBalances(payload: {
  [string]: Big
}): SetTokenBalancesAction {
  return {
    type: 'WALLET_SET_TOKEN_BALANCES',
    payload
  };
}
