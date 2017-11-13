import { Wei, TokenValue } from 'libs/units';
import { IWallet } from 'libs/wallet/IWallet';
import { TypeKeys } from './constants';

/*** Unlock Private Key ***/
export interface PrivateKeyUnlockParams {
  key: string;
  password: string;
}

export interface UnlockPrivateKeyAction {
  type: TypeKeys.WALLET_UNLOCK_PRIVATE_KEY;
  payload: PrivateKeyUnlockParams;
}
export interface UnlockMnemonicAction {
  type: TypeKeys.WALLET_UNLOCK_MNEMONIC;
  payload: MnemonicUnlockParams;
}

export interface UnlockWeb3Action {
  type: TypeKeys.WALLET_UNLOCK_WEB3;
}

/*** Set Wallet ***/
export interface SetWalletAction {
  type: TypeKeys.WALLET_SET;
  payload: IWallet;
}

/*** Reset Wallet ***/
export interface ResetWalletAction {
  type: TypeKeys.WALLET_RESET;
}

/*** Set Balance ***/
export interface SetBalancePendingAction {
  type: TypeKeys.WALLET_SET_BALANCE_PENDING;
}
export interface SetBalanceFullfilledAction {
  type: TypeKeys.WALLET_SET_BALANCE_FULFILLED;
  payload: Wei;
}
export interface SetBalanceRejectedAction {
  type: TypeKeys.WALLET_SET_BALANCE_REJECTED;
}

/*** Set Token Balance ***/
export interface SetTokenBalancesAction {
  type: TypeKeys.WALLET_SET_TOKEN_BALANCES;
  payload: {
    [key: string]: TokenValue;
  };
}

/*** Broadcast Tx ***/
export interface BroadcastTxRequestedAction {
  type: TypeKeys.WALLET_BROADCAST_TX_REQUESTED;
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
  type: TypeKeys.WALLET_UNLOCK_KEYSTORE;
  payload: KeystoreUnlockParams;
}

export interface BroadcastTxSuccededAction {
  type: TypeKeys.WALLET_BROADCAST_TX_SUCCEEDED;
  payload: {
    txHash: string;
    signedTx: string;
  };
}

export interface BroadcastTxFailedAction {
  type: TypeKeys.WALLET_BROADCAST_TX_FAILED;
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
  | SetBalancePendingAction
  | SetBalanceFullfilledAction
  | SetBalanceRejectedAction
  | SetTokenBalancesAction
  | BroadcastTxRequestedAction
  | BroadcastTxFailedAction
  | BroadcastTxSuccededAction;
