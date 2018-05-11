import { Wei, TokenValue } from 'libs/units';
import { IWallet, WalletConfig } from 'libs/wallet';

export enum TypeKeys {
  WALLET_UNLOCK_PRIVATE_KEY = 'WALLET_UNLOCK_PRIVATE_KEY',
  WALLET_UNLOCK_KEYSTORE = 'WALLET_UNLOCK_KEYSTORE',
  WALLET_UNLOCK_MNEMONIC = 'WALLET_UNLOCK_MNEMONIC',
  WALLET_UNLOCK_WEB3 = 'WALLET_UNLOCK_WEB3',
  WALLET_SET = 'WALLET_SET',
  WALLET_SET_BALANCE_PENDING = 'WALLET_SET_BALANCE_PENDING',
  WALLET_SET_BALANCE_FULFILLED = 'WALLET_SET_BALANCE_FULFILLED',
  WALLET_SET_BALANCE_REJECTED = 'WALLET_SET_BALANCE_REJECTED',
  WALLET_SET_TOKEN_BALANCES_PENDING = 'WALLET_SET_TOKEN_BALANCES_PENDING',
  WALLET_SET_TOKEN_BALANCES_FULFILLED = 'WALLET_SET_TOKEN_BALANCES_FULFILLED',
  WALLET_SET_TOKEN_BALANCES_REJECTED = 'WALLET_SET_TOKEN_BALANCES_REJECTED',
  WALLET_SET_PENDING = 'WALLET_SET_PENDING',
  WALLET_SET_NOT_PENDING = 'WALLET_SET_NOT_PENDING',
  WALLET_SET_TOKEN_BALANCE_PENDING = 'WALLET_SET_TOKEN_BALANCE_PENDING',
  WALLET_SET_TOKEN_BALANCE_FULFILLED = 'WALLET_SET_TOKEN_BALANCE_FULFILLED',
  WALLET_SET_TOKEN_BALANCE_REJECTED = 'WALLET_SET_TOKEN_BALANCE_REJECTED',
  WALLET_SCAN_WALLET_FOR_TOKENS = 'WALLET_SCAN_WALLET_FOR_TOKENS',
  WALLET_SET_WALLET_TOKENS = 'WALLET_SET_WALLET_TOKENS',
  WALLET_SET_CONFIG = 'WALLET_SET_CONFIG',
  WALLET_RESET = 'WALLET_RESET',
  WALLET_SET_PASSWORD_PENDING = 'WALLET_SET_PASSWORD_PENDING',
  WALLET_REFRESH_ACCOUNT_BALANCE = 'WALLET_REFRESH_ACCOUNT_BALANCE',
  WALLET_REFRESH_TOKEN_BALANCES = 'WALLET_REFRESH_TOKEN_BALANCES'
}

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

export interface SetWalletAction {
  type: TypeKeys.WALLET_SET;
  payload: IWallet;
}

export interface ResetWalletAction {
  type: TypeKeys.WALLET_RESET;
}

export interface SetWalletPendingAction {
  type: TypeKeys.WALLET_SET_PENDING;
  payload: boolean;
}

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

export interface MnemonicUnlockParams {
  phrase: string;
  pass: string;
  path: string;
  address: string;
}

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

export interface RefreshAccountBalanceAction {
  type: TypeKeys.WALLET_REFRESH_ACCOUNT_BALANCE;
}

export interface RefreshTokenBalancesAction {
  type: TypeKeys.WALLET_REFRESH_TOKEN_BALANCES;
}

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
  | SetPasswordPendingAction
  | RefreshAccountBalanceAction
  | RefreshTokenBalancesAction;
