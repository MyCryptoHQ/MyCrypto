import { BigNumber } from 'bignumber.js';
import { Wei } from 'libs/units';
import { IWallet } from 'libs/wallet/IWallet';

/*** Unlock Private Key ***/
export interface PrivateKeyUnlockParams {
  key: string;
  password: string;
}

export interface UnlockPrivateKeyAction {
  type: 'WALLET_UNLOCK_PRIVATE_KEY';
  payload: PrivateKeyUnlockParams;
}

export function unlockPrivateKey(
  value: PrivateKeyUnlockParams
): UnlockPrivateKeyAction {
  return {
    type: 'WALLET_UNLOCK_PRIVATE_KEY',
    payload: value
  };
}

/*** Unlock Keystore File ***/
export interface KeystoreUnlockParams {
  file: string;
  password: string;
}

export interface UnlockKeystoreAction {
  type: 'WALLET_UNLOCK_KEYSTORE';
  payload: KeystoreUnlockParams;
}

export function unlockKeystore(
  value: KeystoreUnlockParams
): UnlockKeystoreAction {
  return {
    type: 'WALLET_UNLOCK_KEYSTORE',
    payload: value
  };
}

/*** Unlock Mnemonic ***/
export interface MnemonicUnlockParams {
  phrase: string;
  pass: string;
  path: string;
  address: string;
}

export interface UnlockMnemonicAction {
  type: 'WALLET_UNLOCK_MNEMONIC';
  payload: MnemonicUnlockParams;
}

export function unlockMnemonic(
  value: MnemonicUnlockParams
): UnlockMnemonicAction {
  return {
    type: 'WALLET_UNLOCK_MNEMONIC',
    payload: value
  };
}

/*** Set Wallet ***/
export interface SetWalletAction {
  type: 'WALLET_SET';
  payload: IWallet;
}

export function setWallet(value: IWallet): SetWalletAction {
  return {
    type: 'WALLET_SET',
    payload: value
  };
}

/*** Set Balance ***/
export interface SetBalanceAction {
  type: 'WALLET_SET_BALANCE';
  payload: Wei;
}

export function setBalance(value: Wei): SetBalanceAction {
  return {
    type: 'WALLET_SET_BALANCE',
    payload: value
  };
}

/*** Set Token Balance ***/
export interface SetTokenBalancesAction {
  type: 'WALLET_SET_TOKEN_BALANCES';
  payload: {
    [key: string]: BigNumber;
  };
}

export function setTokenBalances(payload: {
  [key: string]: BigNumber;
}): SetTokenBalancesAction {
  return {
    type: 'WALLET_SET_TOKEN_BALANCES',
    payload
  };
}

/*** Broadcast Tx ***/
export interface BroadcastTxRequestedAction {
  type: 'WALLET_BROADCAST_TX_REQUESTED';
  payload: {
    signedTx: string;
  };
}

export function broadcastTx(signedTx: string): BroadcastTxRequestedAction {
  return {
    type: 'WALLET_BROADCAST_TX_REQUESTED',
    payload: {
      signedTx
    }
  };
}

export interface BroadcastTxSuccededAction {
  type: string;
  payload: {
    txHash: string;
    signedTx: string;
  };
}
export function broadcastTxSucceded(
  txHash: string,
  signedTx: string
): BroadcastTxSuccededAction {
  return {
    type: 'WALLET_BROADCAST_TX_SUCCEEDED',
    payload: {
      txHash,
      signedTx
    }
  };
}

export interface BroadcastTxFailedAction {
  type: string;
  payload: {
    signedTx: string;
    error: string;
  };
}

export function broadCastTxFailed(signedTx: string, errorMsg: string) {
  return {
    type: 'WALLET_BROADCAST_TX_FAILED',
    payload: {
      signedTx,
      error: errorMsg
    }
  };
}
/*** Union Type ***/
export type WalletAction =
  | UnlockPrivateKeyAction
  | SetWalletAction
  | SetBalanceAction
  | SetTokenBalancesAction
  | BroadcastTxRequestedAction
  | BroadcastTxFailedAction
  | BroadcastTxSuccededAction;
