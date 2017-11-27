import { Wei, TokenValue } from 'libs/units';
import { IWallet } from 'libs/wallet/IWallet';
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
export function unlockKeystore(
  value: types.KeystoreUnlockParams
): types.UnlockKeystoreAction {
  return {
    type: TypeKeys.WALLET_UNLOCK_KEYSTORE,
    payload: value
  };
}

export type TUnlockMnemonic = typeof unlockMnemonic;
export function unlockMnemonic(
  value: types.MnemonicUnlockParams
): types.UnlockMnemonicAction {
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

export function setBalancePending(): types.SetBalancePendingAction {
  return {
    type: TypeKeys.WALLET_SET_BALANCE_PENDING
  };
}

export type TSetBalance = typeof setBalanceFullfilled;
export function setBalanceFullfilled(
  value: Wei
): types.SetBalanceFullfilledAction {
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

export type TSetTokenBalances = typeof setTokenBalances;
export function setTokenBalances(payload: {
  [key: string]: TokenValue;
}): types.SetTokenBalancesAction {
  return {
    type: TypeKeys.WALLET_SET_TOKEN_BALANCES,
    payload
  };
}

export type TBroadcastTx = typeof broadcastTx;
export function broadcastTx(
  signedTx: string
): types.BroadcastTxRequestedAction {
  return {
    type: TypeKeys.WALLET_BROADCAST_TX_REQUESTED,
    payload: {
      signedTx
    }
  };
}

export type TBroadcastTxSucceded = typeof broadcastTxSucceded;
export function broadcastTxSucceded(
  txHash: string,
  signedTx: string
): types.BroadcastTxSuccededAction {
  return {
    type: TypeKeys.WALLET_BROADCAST_TX_SUCCEEDED,
    payload: {
      txHash,
      signedTx
    }
  };
}

export type TBroadCastTxFailed = typeof broadCastTxFailed;
export function broadCastTxFailed(
  signedTx: string,
  errorMsg: string
): types.BroadcastTxFailedAction {
  return {
    type: TypeKeys.WALLET_BROADCAST_TX_FAILED,
    payload: {
      signedTx,
      error: errorMsg
    }
  };
}

export type TResetWallet = typeof resetWallet;
export function resetWallet(): types.ResetWalletAction {
  return {
    type: TypeKeys.WALLET_RESET
  };
}
