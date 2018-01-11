import { Wei, TokenValue } from 'libs/units';
import { IWallet, WalletConfig } from 'libs/wallet';
import * as types from './actionTypes';
import { TypeKeys } from './constants';
export type TUnlockPrivateKey = typeof unlockPrivateKey;
export function unlockPrivateKey(
  value: types.PrivateKeyUnlockParams
): types.UnlockPrivateKeyAction {
  return {
    type: TypeKeys.WALLET_UNLOCK_PRIVATE_KEY,
    payload: value
  };
}

export type TUnlockKeystore = typeof unlockKeystore;
export function unlockKeystore(value: types.KeystoreUnlockParams): types.UnlockKeystoreAction {
  return {
    type: TypeKeys.WALLET_UNLOCK_KEYSTORE,
    payload: value
  };
}

export type TUnlockMnemonic = typeof unlockMnemonic;
export function unlockMnemonic(value: types.MnemonicUnlockParams): types.UnlockMnemonicAction {
  return {
    type: TypeKeys.WALLET_UNLOCK_MNEMONIC,
    payload: value
  };
}

export type TUnlockWeb3 = typeof unlockWeb3;
export function unlockWeb3(): types.UnlockWeb3Action {
  return {
    type: TypeKeys.WALLET_UNLOCK_WEB3
  };
}

export type TSetWallet = typeof setWallet;
export function setWallet(value: IWallet): types.SetWalletAction {
  return {
    type: TypeKeys.WALLET_SET,
    payload: value
  };
}

export function setWalletPending(loadingStatus: boolean): types.SetWalletPendingAction {
  return {
    type: TypeKeys.WALLET_SET_PENDING,
    payload: loadingStatus
  };
}

export function setBalancePending(): types.SetBalancePendingAction {
  return {
    type: TypeKeys.WALLET_SET_BALANCE_PENDING
  };
}

export function setPasswordPrompt(): types.SetPasswordPendingAction {
  return {
    type: TypeKeys.WALLET_SET_PASSWORD_PENDING
  };
}

export type TSetBalance = typeof setBalanceFullfilled;
export function setBalanceFullfilled(value: Wei): types.SetBalanceFullfilledAction {
  return {
    type: TypeKeys.WALLET_SET_BALANCE_FULFILLED,
    payload: value
  };
}

export function setBalanceRejected(): types.SetBalanceRejectedAction {
  return {
    type: TypeKeys.WALLET_SET_BALANCE_REJECTED
  };
}

export function setTokenBalancesPending(): types.SetTokenBalancesPendingAction {
  return {
    type: TypeKeys.WALLET_SET_TOKEN_BALANCES_PENDING
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
    type: TypeKeys.WALLET_SET_TOKEN_BALANCES_FULFILLED,
    payload
  };
}

export function setTokenBalancesRejected(): types.SetTokenBalancesRejectedAction {
  return {
    type: TypeKeys.WALLET_SET_TOKEN_BALANCES_REJECTED
  };
}

export function setTokenBalancePending(
  payload: types.SetTokenBalancePendingAction['payload']
): types.SetTokenBalancePendingAction {
  return {
    type: TypeKeys.WALLET_SET_TOKEN_BALANCE_PENDING,
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
    type: TypeKeys.WALLET_SET_TOKEN_BALANCE_FULFILLED,
    payload
  };
}

export function setTokenBalanceRejected(): types.SetTokenBalanceRejectedAction {
  return {
    type: TypeKeys.WALLET_SET_TOKEN_BALANCE_REJECTED
  };
}

export type TScanWalletForTokens = typeof scanWalletForTokens;
export function scanWalletForTokens(wallet: IWallet): types.ScanWalletForTokensAction {
  return {
    type: TypeKeys.WALLET_SCAN_WALLET_FOR_TOKENS,
    payload: wallet
  };
}

export type TSetWalletTokens = typeof setWalletTokens;
export function setWalletTokens(tokens: string[]): types.SetWalletTokensAction {
  return {
    type: TypeKeys.WALLET_SET_WALLET_TOKENS,
    payload: tokens
  };
}

export type TResetWallet = typeof resetWallet;
export function resetWallet(): types.ResetWalletAction {
  return {
    type: TypeKeys.WALLET_RESET
  };
}

export type TSetWalletConfig = typeof setWalletConfig;
export function setWalletConfig(config: WalletConfig): types.SetWalletConfigAction {
  return {
    type: TypeKeys.WALLET_SET_CONFIG,
    payload: config
  };
}
