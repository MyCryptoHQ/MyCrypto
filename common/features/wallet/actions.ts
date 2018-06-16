import { Wei, TokenValue } from 'libs/units';
import { IWallet, WalletConfig } from 'libs/wallet';
import * as walletTypes from './types';

export type TUnlockPrivateKey = typeof unlockPrivateKey;
export function unlockPrivateKey(
  value: walletTypes.PrivateKeyUnlockParams
): walletTypes.UnlockPrivateKeyAction {
  return {
    type: walletTypes.WalletActions.UNLOCK_PRIVATE_KEY,
    payload: value
  };
}

export type TUnlockKeystore = typeof unlockKeystore;
export function unlockKeystore(
  value: walletTypes.KeystoreUnlockParams
): walletTypes.UnlockKeystoreAction {
  return {
    type: walletTypes.WalletActions.UNLOCK_KEYSTORE,
    payload: value
  };
}

export type TUnlockMnemonic = typeof unlockMnemonic;
export function unlockMnemonic(
  value: walletTypes.MnemonicUnlockParams
): walletTypes.UnlockMnemonicAction {
  return {
    type: walletTypes.WalletActions.UNLOCK_MNEMONIC,
    payload: value
  };
}

export type TUnlockWeb3 = typeof unlockWeb3;
export function unlockWeb3(): walletTypes.UnlockWeb3Action {
  return {
    type: walletTypes.WalletActions.UNLOCK_WEB3
  };
}

export type TSetWallet = typeof setWallet;
export function setWallet(value: IWallet): walletTypes.SetWalletAction {
  return {
    type: walletTypes.WalletActions.SET,
    payload: value
  };
}

export function setWalletPending(loadingStatus: boolean): walletTypes.SetWalletPendingAction {
  return {
    type: walletTypes.WalletActions.SET_PENDING,
    payload: loadingStatus
  };
}

export function setBalancePending(): walletTypes.SetBalancePendingAction {
  return {
    type: walletTypes.WalletActions.SET_BALANCE_PENDING
  };
}

export function setPasswordPrompt(): walletTypes.SetPasswordPendingAction {
  return {
    type: walletTypes.WalletActions.SET_PASSWORD_PENDING
  };
}

export type TSetBalance = typeof setBalanceFullfilled;
export function setBalanceFullfilled(value: Wei): walletTypes.SetBalanceFullfilledAction {
  return {
    type: walletTypes.WalletActions.SET_BALANCE_FULFILLED,
    payload: value
  };
}

export function setBalanceRejected(): walletTypes.SetBalanceRejectedAction {
  return {
    type: walletTypes.WalletActions.SET_BALANCE_REJECTED
  };
}

export function setTokenBalancesPending(): walletTypes.SetTokenBalancesPendingAction {
  return {
    type: walletTypes.WalletActions.SET_TOKEN_BALANCES_PENDING
  };
}

export type TSetTokenBalancesFulfilled = typeof setTokenBalancesFulfilled;
export function setTokenBalancesFulfilled(payload: {
  [key: string]: {
    balance: TokenValue;
    error: string | null;
  };
}): walletTypes.SetTokenBalancesFulfilledAction {
  return {
    type: walletTypes.WalletActions.SET_TOKEN_BALANCES_FULFILLED,
    payload
  };
}

export function setTokenBalancesRejected(): walletTypes.SetTokenBalancesRejectedAction {
  return {
    type: walletTypes.WalletActions.SET_TOKEN_BALANCES_REJECTED
  };
}

export function setTokenBalancePending(
  payload: walletTypes.SetTokenBalancePendingAction['payload']
): walletTypes.SetTokenBalancePendingAction {
  return {
    type: walletTypes.WalletActions.SET_TOKEN_BALANCE_PENDING,
    payload
  };
}

export type TSetTokenBalanceFulfilled = typeof setTokenBalanceFulfilled;
export function setTokenBalanceFulfilled(payload: {
  [key: string]: {
    balance: TokenValue;
    error: string | null;
  };
}): walletTypes.SetTokenBalanceFulfilledAction {
  return {
    type: walletTypes.WalletActions.SET_TOKEN_BALANCE_FULFILLED,
    payload
  };
}

export function setTokenBalanceRejected(): walletTypes.SetTokenBalanceRejectedAction {
  return {
    type: walletTypes.WalletActions.SET_TOKEN_BALANCE_REJECTED
  };
}

export type TScanWalletForTokens = typeof scanWalletForTokens;
export function scanWalletForTokens(wallet: IWallet): walletTypes.ScanWalletForTokensAction {
  return {
    type: walletTypes.WalletActions.SCAN_WALLET_FOR_TOKENS,
    payload: wallet
  };
}

export type TSetWalletTokens = typeof setWalletTokens;
export function setWalletTokens(tokens: string[]): walletTypes.SetWalletTokensAction {
  return {
    type: walletTypes.WalletActions.SET_WALLET_TOKENS,
    payload: tokens
  };
}

export type TResetWallet = typeof resetWallet;
export function resetWallet(): walletTypes.ResetWalletAction {
  return {
    type: walletTypes.WalletActions.RESET
  };
}

export type TSetWalletConfig = typeof setWalletConfig;
export function setWalletConfig(config: WalletConfig): walletTypes.SetWalletConfigAction {
  return {
    type: walletTypes.WalletActions.SET_CONFIG,
    payload: config
  };
}

export type TRefreshAccountBalance = typeof refreshAccountBalance;
export function refreshAccountBalance(): walletTypes.RefreshAccountBalanceAction {
  return {
    type: walletTypes.WalletActions.REFRESH_ACCOUNT_BALANCE
  };
}

export type TRefreshTokenBalances = typeof refreshTokenBalances;
export function refreshTokenBalances(): walletTypes.RefreshTokenBalancesAction {
  return {
    type: walletTypes.WalletActions.REFRESH_TOKEN_BALANCES
  };
}
