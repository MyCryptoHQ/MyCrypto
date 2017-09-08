// @flow
import type { IWallet } from 'libs/wallet/IWallet';
import Big from 'bignumber.js';
import { Wei } from 'libs/units';

/*** Unlock Private Key ***/
export type PrivateKeyUnlockParams = {
  key: string,
  password: string
};

export type UnlockPrivateKeyAction = {
  type: 'WALLET_UNLOCK_PRIVATE_KEY',
  payload: PrivateKeyUnlockParams
};

export function unlockPrivateKey(
  value: PrivateKeyUnlockParams
): UnlockPrivateKeyAction {
  return {
    type: 'WALLET_UNLOCK_PRIVATE_KEY',
    payload: value
  };
}

/*** Unlock Keystore File ***/
export type KeystoreUnlockParams = {
  file: string,
  password: string
};

export type UnlockKeystoreAction = {
  type: 'WALLET_UNLOCK_KEYSTORE',
  payload: KeystoreUnlockParams
};

export function unlockKeystore(
  value: KeystoreUnlockParams
): UnlockKeystoreAction {
  return {
    type: 'WALLET_UNLOCK_KEYSTORE',
    payload: value
  };
}

/*** Unlock Mnemonic ***/
export type MnemonicUnlockParams = {
  phrase: string,
  pass: string,
  path: string,
  address: string
};

export type UnlockMnemonicAction = {
  type: 'WALLET_UNLOCK_MNEMONIC',
  payload: MnemonicUnlockParams
};

export function unlockMnemonic(
  value: MnemonicUnlockParams
): UnlockMnemonicAction {
  return {
    type: 'WALLET_UNLOCK_MNEMONIC',
    payload: value
  };
}

/*** Set Wallet ***/
export type SetWalletAction = {
  type: 'WALLET_SET',
  payload: IWallet
};

export function setWallet(value: IWallet): SetWalletAction {
  return {
    type: 'WALLET_SET',
    payload: value
  };
}

/*** Set Balance ***/
export type SetBalanceAction = {
  type: 'WALLET_SET_BALANCE',
  payload: Wei
};

export function setBalance(value: Wei): SetBalanceAction {
  return {
    type: 'WALLET_SET_BALANCE',
    payload: value
  };
}

/*** Set Token Balance ***/
export type SetTokenBalancesAction = {
  type: 'WALLET_SET_TOKEN_BALANCES',
  payload: {
    [string]: Big
  }
};

export function setTokenBalances(payload: {
  [string]: Big
}): SetTokenBalancesAction {
  return {
    type: 'WALLET_SET_TOKEN_BALANCES',
    payload
  };
}

/*** Broadcast Tx ***/
export type BroadcastTxRequestedAction = {
  type: 'WALLET_BROADCAST_TX_REQUESTED',
  payload: {
    signedTx: string
  }
};

export function broadcastTx(signedTx: string): BroadcastTxRequestedAction {
  return {
    type: 'WALLET_BROADCAST_TX_REQUESTED',
    payload: {
      signedTx
    }
  };
}

/*** Union Type ***/
export type WalletAction =
  | UnlockPrivateKeyAction
  | SetWalletAction
  | SetBalanceAction
  | SetTokenBalancesAction
  | BroadcastTxRequestedAction;
