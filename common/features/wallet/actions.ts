import { Wei, TokenValue } from 'libs/units';
import { IWallet, WalletConfig } from 'libs/wallet';
import {
  WALLET,
  PrivateKeyUnlockParams,
  UnlockPrivateKeyAction,
  KeystoreUnlockParams,
  UnlockKeystoreAction,
  MnemonicUnlockParams,
  UnlockMnemonicAction,
  UnlockWeb3Action,
  SetWalletPendingAction,
  SetWalletAction,
  SetPasswordPendingAction,
  SetBalancePendingAction,
  SetBalanceFullfilledAction,
  SetBalanceRejectedAction,
  SetTokenBalancePendingAction,
  SetTokenBalanceFulfilledAction,
  SetTokenBalanceRejectedAction,
  SetTokenBalancesPendingAction,
  SetTokenBalancesFulfilledAction,
  SetTokenBalancesRejectedAction,
  ScanWalletForTokensAction,
  SetWalletTokensAction,
  ResetWalletAction,
  SetWalletConfigAction,
  RefreshAccountBalanceAction,
  RefreshTokenBalancesAction
} from './types';

export type TUnlockPrivateKey = typeof unlockPrivateKey;
export function unlockPrivateKey(value: PrivateKeyUnlockParams): UnlockPrivateKeyAction {
  return {
    type: WALLET.UNLOCK_PRIVATE_KEY,
    payload: value
  };
}

export type TUnlockKeystore = typeof unlockKeystore;
export function unlockKeystore(value: KeystoreUnlockParams): UnlockKeystoreAction {
  return {
    type: WALLET.UNLOCK_KEYSTORE,
    payload: value
  };
}

export type TUnlockMnemonic = typeof unlockMnemonic;
export function unlockMnemonic(value: MnemonicUnlockParams): UnlockMnemonicAction {
  return {
    type: WALLET.UNLOCK_MNEMONIC,
    payload: value
  };
}

export type TUnlockWeb3 = typeof unlockWeb3;
export function unlockWeb3(): UnlockWeb3Action {
  return {
    type: WALLET.UNLOCK_WEB3
  };
}

export type TSetWallet = typeof setWallet;
export function setWallet(value: IWallet): SetWalletAction {
  return {
    type: WALLET.SET,
    payload: value
  };
}

export function setWalletPending(loadingStatus: boolean): SetWalletPendingAction {
  return {
    type: WALLET.SET_PENDING,
    payload: loadingStatus
  };
}

export function setBalancePending(): SetBalancePendingAction {
  return {
    type: WALLET.SET_BALANCE_PENDING
  };
}

export function setPasswordPrompt(): SetPasswordPendingAction {
  return {
    type: WALLET.SET_PASSWORD_PENDING
  };
}

export type TSetBalance = typeof setBalanceFullfilled;
export function setBalanceFullfilled(value: Wei): SetBalanceFullfilledAction {
  return {
    type: WALLET.SET_BALANCE_FULFILLED,
    payload: value
  };
}

export function setBalanceRejected(): SetBalanceRejectedAction {
  return {
    type: WALLET.SET_BALANCE_REJECTED
  };
}

export function setTokenBalancesPending(): SetTokenBalancesPendingAction {
  return {
    type: WALLET.SET_TOKEN_BALANCES_PENDING
  };
}

export type TSetTokenBalancesFulfilled = typeof setTokenBalancesFulfilled;
export function setTokenBalancesFulfilled(payload: {
  [key: string]: {
    balance: TokenValue;
    error: string | null;
  };
}): SetTokenBalancesFulfilledAction {
  return {
    type: WALLET.SET_TOKEN_BALANCES_FULFILLED,
    payload
  };
}

export function setTokenBalancesRejected(): SetTokenBalancesRejectedAction {
  return {
    type: WALLET.SET_TOKEN_BALANCES_REJECTED
  };
}

export function setTokenBalancePending(
  payload: SetTokenBalancePendingAction['payload']
): SetTokenBalancePendingAction {
  return {
    type: WALLET.SET_TOKEN_BALANCE_PENDING,
    payload
  };
}

export type TSetTokenBalanceFulfilled = typeof setTokenBalanceFulfilled;
export function setTokenBalanceFulfilled(payload: {
  [key: string]: {
    balance: TokenValue;
    error: string | null;
  };
}): SetTokenBalanceFulfilledAction {
  return {
    type: WALLET.SET_TOKEN_BALANCE_FULFILLED,
    payload
  };
}

export function setTokenBalanceRejected(): SetTokenBalanceRejectedAction {
  return {
    type: WALLET.SET_TOKEN_BALANCE_REJECTED
  };
}

export type TScanWalletForTokens = typeof scanWalletForTokens;
export function scanWalletForTokens(wallet: IWallet): ScanWalletForTokensAction {
  return {
    type: WALLET.SCAN_WALLET_FOR_TOKENS,
    payload: wallet
  };
}

export type TSetWalletTokens = typeof setWalletTokens;
export function setWalletTokens(tokens: string[]): SetWalletTokensAction {
  return {
    type: WALLET.SET_WALLET_TOKENS,
    payload: tokens
  };
}

export type TResetWallet = typeof resetWallet;
export function resetWallet(): ResetWalletAction {
  return {
    type: WALLET.RESET
  };
}

export type TSetWalletConfig = typeof setWalletConfig;
export function setWalletConfig(config: WalletConfig): SetWalletConfigAction {
  return {
    type: WALLET.SET_CONFIG,
    payload: config
  };
}

export type TRefreshAccountBalance = typeof refreshAccountBalance;
export function refreshAccountBalance(): RefreshAccountBalanceAction {
  return {
    type: WALLET.REFRESH_ACCOUNT_BALANCE
  };
}

export type TRefreshTokenBalances = typeof refreshTokenBalances;
export function refreshTokenBalances(): RefreshTokenBalancesAction {
  return {
    type: WALLET.REFRESH_TOKEN_BALANCES
  };
}
