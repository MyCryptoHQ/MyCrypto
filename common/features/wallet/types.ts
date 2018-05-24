import { Wei, TokenValue } from 'libs/units';
import { IWallet, WalletConfig, Balance } from 'libs/wallet';

export interface WalletState {
  inst?: IWallet | null;
  config?: WalletConfig | null;
  // in ETH
  balance: Balance;
  tokens: {
    [key: string]: {
      balance: TokenValue;
      error: string | null;
    };
  };
  isWalletPending: boolean;
  isTokensLoading: boolean;
  isPasswordPending: boolean;
  tokensError: string | null;
  hasSavedWalletTokens: boolean;
  recentAddresses: string[];
}

export enum WALLET {
  UNLOCK_PRIVATE_KEY = 'WALLET_UNLOCK_PRIVATE_KEY',
  UNLOCK_KEYSTORE = 'WALLET_UNLOCK_KEYSTORE',
  UNLOCK_MNEMONIC = 'WALLET_UNLOCK_MNEMONIC',
  UNLOCK_WEB3 = 'WALLET_UNLOCK_WEB3',
  SET = 'WALLET_SET',
  SET_BALANCE_PENDING = 'WALLET_SET_BALANCE_PENDING',
  SET_BALANCE_FULFILLED = 'WALLET_SET_BALANCE_FULFILLED',
  SET_BALANCE_REJECTED = 'WALLET_SET_BALANCE_REJECTED',
  SET_TOKEN_BALANCES_PENDING = 'WALLET_SET_TOKEN_BALANCES_PENDING',
  SET_TOKEN_BALANCES_FULFILLED = 'WALLET_SET_TOKEN_BALANCES_FULFILLED',
  SET_TOKEN_BALANCES_REJECTED = 'WALLET_SET_TOKEN_BALANCES_REJECTED',
  SET_PENDING = 'WALLET_SET_PENDING',
  SET_NOT_PENDING = 'WALLET_SET_NOT_PENDING',
  SET_TOKEN_BALANCE_PENDING = 'WALLET_SET_TOKEN_BALANCE_PENDING',
  SET_TOKEN_BALANCE_FULFILLED = 'WALLET_SET_TOKEN_BALANCE_FULFILLED',
  SET_TOKEN_BALANCE_REJECTED = 'WALLET_SET_TOKEN_BALANCE_REJECTED',
  SCAN_WALLET_FOR_TOKENS = 'WALLET_SCAN_WALLET_FOR_TOKENS',
  SET_WALLET_TOKENS = 'WALLET_SET_WALLET_TOKENS',
  SET_CONFIG = 'WALLET_SET_CONFIG',
  RESET = 'WALLET_RESET',
  SET_PASSWORD_PENDING = 'WALLET_SET_PASSWORD_PENDING',
  REFRESH_ACCOUNT_BALANCE = 'WALLET_REFRESH_ACCOUNT_BALANCE',
  REFRESH_TOKEN_BALANCES = 'WALLET_REFRESH_TOKEN_BALANCES'
}

export interface PrivateKeyUnlockParams {
  key: string;
  password: string;
}

export interface UnlockPrivateKeyAction {
  type: WALLET.UNLOCK_PRIVATE_KEY;
  payload: PrivateKeyUnlockParams;
}
export interface UnlockMnemonicAction {
  type: WALLET.UNLOCK_MNEMONIC;
  payload: MnemonicUnlockParams;
}

export interface UnlockWeb3Action {
  type: WALLET.UNLOCK_WEB3;
}

export interface SetWalletAction {
  type: WALLET.SET;
  payload: IWallet;
}

export interface ResetWalletAction {
  type: WALLET.RESET;
}

export interface SetWalletPendingAction {
  type: WALLET.SET_PENDING;
  payload: boolean;
}

export interface SetBalancePendingAction {
  type: WALLET.SET_BALANCE_PENDING;
}

export interface SetBalanceFullfilledAction {
  type: WALLET.SET_BALANCE_FULFILLED;
  payload: Wei;
}

export interface SetBalanceRejectedAction {
  type: WALLET.SET_BALANCE_REJECTED;
}

export interface SetTokenBalancesPendingAction {
  type: WALLET.SET_TOKEN_BALANCES_PENDING;
}

export interface SetTokenBalancesFulfilledAction {
  type: WALLET.SET_TOKEN_BALANCES_FULFILLED;
  payload: {
    [key: string]: {
      balance: TokenValue;
      error: string | null;
    };
  };
}

export interface SetTokenBalancesRejectedAction {
  type: WALLET.SET_TOKEN_BALANCES_REJECTED;
}

export interface SetTokenBalancePendingAction {
  type: WALLET.SET_TOKEN_BALANCE_PENDING;
  payload: { tokenSymbol: string };
}

export interface SetTokenBalanceFulfilledAction {
  type: WALLET.SET_TOKEN_BALANCE_FULFILLED;
  payload: {
    [key: string]: {
      balance: TokenValue;
      error: string | null;
    };
  };
}

export interface SetTokenBalanceRejectedAction {
  type: WALLET.SET_TOKEN_BALANCE_REJECTED;
}

export interface ScanWalletForTokensAction {
  type: WALLET.SCAN_WALLET_FOR_TOKENS;
  payload: IWallet;
}

export interface SetWalletTokensAction {
  type: WALLET.SET_WALLET_TOKENS;
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
  type: WALLET.UNLOCK_KEYSTORE;
  payload: KeystoreUnlockParams;
}

export interface SetWalletConfigAction {
  type: WALLET.SET_CONFIG;
  payload: WalletConfig;
}

export interface SetPasswordPendingAction {
  type: WALLET.SET_PASSWORD_PENDING;
}

export interface RefreshAccountBalanceAction {
  type: WALLET.REFRESH_ACCOUNT_BALANCE;
}

export interface RefreshTokenBalancesAction {
  type: WALLET.REFRESH_TOKEN_BALANCES;
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
