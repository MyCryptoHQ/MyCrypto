import { Wei, TokenValue } from 'libs/units';
import { IWallet, WalletConfig } from 'libs/wallet';
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

export interface SetWalletPendingAction {
  type: TypeKeys.WALLET_SET_PENDING;
  payload: boolean;
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
export interface SetTokenBalancesPendingAction {
  type: TypeKeys.WALLET_SET_TOKEN_BALANCES_PENDING;
}

export interface SetTokenBalancesFulfilledAction {
  type: TypeKeys.WALLET_SET_TOKEN_BALANCES_FULFILLED;
  payload: {
    [key: string]: {
      balance: TokenValue;
      error: string | null;
    };
  };
}

export interface SetTokenBalancesRejectedAction {
  type: TypeKeys.WALLET_SET_TOKEN_BALANCES_REJECTED;
}

export interface SetTokenBalancePendingAction {
  type: TypeKeys.WALLET_SET_TOKEN_BALANCE_PENDING;
  payload: { tokenSymbol: string };
}

export interface SetTokenBalanceFulfilledAction {
  type: TypeKeys.WALLET_SET_TOKEN_BALANCE_FULFILLED;
  payload: {
    [key: string]: {
      balance: TokenValue;
      error: string | null;
    };
  };
}

export interface SetTokenBalanceRejectedAction {
  type: TypeKeys.WALLET_SET_TOKEN_BALANCE_REJECTED;
}

export interface ScanWalletForTokensAction {
  type: TypeKeys.WALLET_SCAN_WALLET_FOR_TOKENS;
  payload: IWallet;
}

export interface SetWalletTokensAction {
  type: TypeKeys.WALLET_SET_WALLET_TOKENS;
  payload: string[];
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

export interface SetWalletConfigAction {
  type: TypeKeys.WALLET_SET_CONFIG;
  payload: WalletConfig;
}

export interface SetPasswordPendingAction {
  type: TypeKeys.WALLET_SET_PASSWORD_PENDING;
}

/*** Union Type ***/
export type WalletAction =
  | UnlockPrivateKeyAction
  | SetWalletAction
  | SetWalletPendingAction
  | ResetWalletAction
  | SetBalancePendingAction
  | SetBalanceFullfilledAction
  | SetBalanceRejectedAction
  | SetTokenBalancesPendingAction
  | SetTokenBalancesFulfilledAction
  | SetTokenBalancesRejectedAction
  | SetTokenBalancePendingAction
  | SetTokenBalanceFulfilledAction
  | SetTokenBalanceRejectedAction
  | ScanWalletForTokensAction
  | SetWalletTokensAction
  | SetWalletConfigAction
  | SetPasswordPendingAction;
