import { Wei, TokenValue } from 'libs/units';
import { IWallet, WalletConfig, Balance } from 'libs/wallet';
import { Token } from 'types/network';

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
  accessMessage: string;
}

export enum WalletActions {
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
  REFRESH_TOKEN_BALANCES = 'WALLET_REFRESH_TOKEN_BALANCES',
  SET_ACCESS_MESSAGE = 'SET_ACCESS_MESSAGE'
}

export interface PrivateKeyUnlockParams {
  key: string;
  password: string;
}

export interface UnlockPrivateKeyAction {
  type: WalletActions.UNLOCK_PRIVATE_KEY;
  payload: PrivateKeyUnlockParams;
}
export interface UnlockMnemonicAction {
  type: WalletActions.UNLOCK_MNEMONIC;
  payload: MnemonicUnlockParams;
}

export interface UnlockWeb3Action {
  type: WalletActions.UNLOCK_WEB3;
}

export interface SetWalletAction {
  type: WalletActions.SET;
  payload: IWallet;
}

export interface ResetWalletAction {
  type: WalletActions.RESET;
}

export interface SetWalletPendingAction {
  type: WalletActions.SET_PENDING;
  payload: boolean;
}

export interface SetBalancePendingAction {
  type: WalletActions.SET_BALANCE_PENDING;
}

export interface SetBalanceFullfilledAction {
  type: WalletActions.SET_BALANCE_FULFILLED;
  payload: Wei;
}

export interface SetBalanceRejectedAction {
  type: WalletActions.SET_BALANCE_REJECTED;
}

export interface SetTokenBalancesPendingAction {
  type: WalletActions.SET_TOKEN_BALANCES_PENDING;
}

export interface SetTokenBalancesFulfilledAction {
  type: WalletActions.SET_TOKEN_BALANCES_FULFILLED;
  payload: {
    [key: string]: {
      balance: TokenValue;
      error: string | null;
    };
  };
}

export interface SetTokenBalancesRejectedAction {
  type: WalletActions.SET_TOKEN_BALANCES_REJECTED;
}

export interface SetTokenBalancePendingAction {
  type: WalletActions.SET_TOKEN_BALANCE_PENDING;
  payload: { tokenSymbol: string };
}

export interface SetTokenBalanceFulfilledAction {
  type: WalletActions.SET_TOKEN_BALANCE_FULFILLED;
  payload: {
    [key: string]: {
      balance: TokenValue;
      error: string | null;
    };
  };
}

export interface SetTokenBalanceRejectedAction {
  type: WalletActions.SET_TOKEN_BALANCE_REJECTED;
}

export interface ScanWalletForTokensAction {
  type: WalletActions.SCAN_WALLET_FOR_TOKENS;
  payload: IWallet;
}

export interface SetWalletTokensAction {
  type: WalletActions.SET_WALLET_TOKENS;
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
  type: WalletActions.UNLOCK_KEYSTORE;
  payload: KeystoreUnlockParams;
}

export interface SetWalletConfigAction {
  type: WalletActions.SET_CONFIG;
  payload: WalletConfig;
}

export interface SetPasswordPendingAction {
  type: WalletActions.SET_PASSWORD_PENDING;
}

export interface RefreshAccountBalanceAction {
  type: WalletActions.REFRESH_ACCOUNT_BALANCE;
}

export interface RefreshTokenBalancesAction {
  type: WalletActions.REFRESH_TOKEN_BALANCES;
}

export interface SetAccessMessageAction {
  type: WalletActions.SET_ACCESS_MESSAGE;
  payload: string;
}

export interface TokenBalance {
  symbol: string;
  balance: TokenValue;
  custom: boolean;
  decimal: number;
  error: string | null;
}

export type MergedToken = Token & {
  custom: boolean;
};

export interface TokenBalanceLookup {
  [symbol: string]: TokenBalance;
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
  | RefreshTokenBalancesAction
  | SetAccessMessageAction;
