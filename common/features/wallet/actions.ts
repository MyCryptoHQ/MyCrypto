import { Wei, TokenValue } from 'libs/units';
import { IWallet, WalletConfig } from 'libs/wallet';
import * as types from './types';

export type TUnlockPrivateKey = typeof unlockPrivateKey;
export function unlockPrivateKey(
  value: types.PrivateKeyUnlockParams
): types.UnlockPrivateKeyAction {
  return {
    type: types.WalletActions.UNLOCK_PRIVATE_KEY,
    payload: value
  };
}

export type TUnlockKeystore = typeof unlockKeystore;
export function unlockKeystore(value: types.KeystoreUnlockParams): types.UnlockKeystoreAction {
  return {
    type: types.WalletActions.UNLOCK_KEYSTORE,
    payload: value
  };
}

export type TUnlockMnemonic = typeof unlockMnemonic;
export function unlockMnemonic(value: types.MnemonicUnlockParams): types.UnlockMnemonicAction {
  return {
    type: types.WalletActions.UNLOCK_MNEMONIC,
    payload: value
  };
}

export type TUnlockWeb3 = typeof unlockWeb3;
export function unlockWeb3(): types.UnlockWeb3Action {
  return {
    type: types.WalletActions.UNLOCK_WEB3
  };
}

export type TSetWallet = typeof setWallet;
export function setWallet(value: IWallet): types.SetWalletAction {
  return {
    type: types.WalletActions.SET,
    payload: value
  };
}

export function setWalletPending(loadingStatus: boolean): types.SetWalletPendingAction {
  return {
    type: types.WalletActions.SET_PENDING,
    payload: loadingStatus
  };
}

export function setBalancePending(): types.SetBalancePendingAction {
  return {
    type: types.WalletActions.SET_BALANCE_PENDING
  };
}

export function setPasswordPrompt(): types.SetPasswordPendingAction {
  return {
    type: types.WalletActions.SET_PASSWORD_PENDING
  };
}

export type TSetBalance = typeof setBalanceFullfilled;
export function setBalanceFullfilled(value: Wei): types.SetBalanceFullfilledAction {
  return {
    type: types.WalletActions.SET_BALANCE_FULFILLED,
    payload: value
  };
}

export function setBalanceRejected(): types.SetBalanceRejectedAction {
  return {
    type: types.WalletActions.SET_BALANCE_REJECTED
  };
}

export function setTokenBalancesPending(): types.SetTokenBalancesPendingAction {
  return {
    type: types.WalletActions.SET_TOKEN_BALANCES_PENDING
  };
}

export type TSetTokenBalancesFulfilled = typeof setTokenBalancesFulfilled;
export function setTokenBalancesFulfilled(payload: {
  [key: string]: {
    balance: TokenValue;
    error: string | null;
  };
}): types.SetTokenBalancesFulfilledAction {
  return {
    type: types.WalletActions.SET_TOKEN_BALANCES_FULFILLED,
    payload
  };
}

export function setTokenBalancesRejected(): types.SetTokenBalancesRejectedAction {
  return {
    type: types.WalletActions.SET_TOKEN_BALANCES_REJECTED
  };
}

export function setTokenBalancePending(
  payload: types.SetTokenBalancePendingAction['payload']
): types.SetTokenBalancePendingAction {
  return {
    type: types.WalletActions.SET_TOKEN_BALANCE_PENDING,
    payload
  };
}

export type TSetTokenBalanceFulfilled = typeof setTokenBalanceFulfilled;
export function setTokenBalanceFulfilled(payload: {
  [key: string]: {
    balance: TokenValue;
    error: string | null;
  };
}): types.SetTokenBalanceFulfilledAction {
  return {
    type: types.WalletActions.SET_TOKEN_BALANCE_FULFILLED,
    payload
  };
}

export function setTokenBalanceRejected(): types.SetTokenBalanceRejectedAction {
  return {
    type: types.WalletActions.SET_TOKEN_BALANCE_REJECTED
  };
}

export type TScanWalletForTokens = typeof scanWalletForTokens;
export function scanWalletForTokens(wallet: IWallet): types.ScanWalletForTokensAction {
  return {
    type: types.WalletActions.SCAN_WALLET_FOR_TOKENS,
    payload: wallet
  };
}

export type TSetWalletTokens = typeof setWalletTokens;
export function setWalletTokens(tokens: string[]): types.SetWalletTokensAction {
  return {
    type: types.WalletActions.SET_WALLET_TOKENS,
    payload: tokens
  };
}

export type TResetWallet = typeof resetWallet;
export function resetWallet(): types.ResetWalletAction {
  return {
    type: types.WalletActions.RESET
  };
}

export type TSetWalletConfig = typeof setWalletConfig;
export function setWalletConfig(config: WalletConfig): types.SetWalletConfigAction {
  return {
    type: types.WalletActions.SET_CONFIG,
    payload: config
  };
}

export type TRefreshAccountBalance = typeof refreshAccountBalance;
export function refreshAccountBalance(): types.RefreshAccountBalanceAction {
  return {
    type: types.WalletActions.REFRESH_ACCOUNT_BALANCE
  };
}

export type TRefreshTokenBalances = typeof refreshTokenBalances;
export function refreshTokenBalances(): types.RefreshTokenBalancesAction {
  return {
    type: types.WalletActions.REFRESH_TOKEN_BALANCES
  };
}
