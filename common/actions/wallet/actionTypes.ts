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
export interface UnlockMnemonicAction {
  type: 'WALLET_UNLOCK_MNEMONIC';
  payload: MnemonicUnlockParams;
}

/*** Set Wallet ***/
export interface SetWalletAction {
  type: 'WALLET_SET';
  payload: IWallet;
}

/*** Reset Wallet ***/
export interface ResetWalletAction {
  type: 'WALLET_RESET';
}

/*** Set Balance ***/
export interface SetBalanceAction {
  type: 'WALLET_SET_BALANCE';
  payload: Wei;
}

/*** Set Token Balance ***/
export interface SetTokenBalancesAction {
  type: 'WALLET_SET_TOKEN_BALANCES';
  payload: {
    [key: string]: BigNumber;
  };
}

/*** Broadcast Tx ***/
export interface BroadcastTxRequestedAction {
  type: 'WALLET_BROADCAST_TX_REQUESTED';
  payload: {
    signedTx: string;
  };
}

/*** Unlock Mnemonic ***/
export interface MnemonicUnlockParams {
  phrase: string;
  pass: string;
  path: string;
  address: string;
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

export interface BroadcastTxSuccededAction {
  type: 'WALLET_BROADCAST_TX_SUCCEEDED';
  payload: {
    txHash: string;
    signedTx: string;
  };
}

export interface BroadcastTxFailedAction {
  type: 'WALLET_BROADCAST_TX_FAILED';
  payload: {
    signedTx: string;
    error: string;
  };
}

/*** Union Type ***/
export type WalletAction =
  | UnlockPrivateKeyAction
  | SetWalletAction
  | ResetWalletAction
  | SetBalanceAction
  | SetTokenBalancesAction
  | BroadcastTxRequestedAction
  | BroadcastTxFailedAction
  | BroadcastTxSuccededAction;
