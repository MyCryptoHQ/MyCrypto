// @flow
import type { PrivateKeyUnlockParams } from 'libs/wallet/privkey';
import BaseWallet from 'libs/wallet/base';

export type UnlockPrivateKeyAction = {
  type: 'WALLET_UNLOCK_PRIVATE_KEY',
  payload: PrivateKeyUnlockParams
};

export type SaveWalletAction = {
  type: 'WALLET_SAVE',
  payload: BaseWallet
};

export type InitWalletAction = {
  type: 'WALLET_INIT'
};

export type WalletAction =
  | UnlockPrivateKeyAction
  | SaveWalletAction
  | InitWalletAction;

export function unlockPrivateKey(
  value: PrivateKeyUnlockParams
): UnlockPrivateKeyAction {
  return {
    type: 'WALLET_UNLOCK_PRIVATE_KEY',
    payload: value
  };
}

export function saveWallet(value: BaseWallet): SaveWalletAction {
  return {
    type: 'WALLET_SAVE',
    payload: value
  };
}

export function initWallet(): InitWalletAction {
  return {
    type: 'WALLET_INIT'
  };
}
