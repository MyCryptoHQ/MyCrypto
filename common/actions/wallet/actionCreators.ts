import { BigNumber } from 'bignumber.js';
import { Wei } from 'libs/units';
import { IWallet } from 'libs/wallet/IWallet';
import * as types from './actionTypes';
import * as constants from './constants';

export type TUnlockPrivateKey = typeof unlockPrivateKey;
export function unlockPrivateKey(
  value: types.PrivateKeyUnlockParams
): types.UnlockPrivateKeyAction {
  return {
    type: constants.WALLET_UNLOCK_PRIVATE_KEY,
    payload: value
  };
}

export type TUnlockKeystore = typeof unlockKeystore;
export function unlockKeystore(
  value: types.KeystoreUnlockParams
): types.UnlockKeystoreAction {
  return {
    type: constants.WALLET_UNLOCK_KEYSTORE,
    payload: value
  };
}

export type TUnlockMnemonic = typeof unlockMnemonic;
export function unlockMnemonic(
  value: types.MnemonicUnlockParams
): types.UnlockMnemonicAction {
  return {
    type: constants.WALLET_UNLOCK_MNEMONIC,
    payload: value
  };
}

export type TSetWallet = typeof setWallet;
export function setWallet(value: IWallet): types.SetWalletAction {
  return {
    type: constants.WALLET_SET,
    payload: value
  };
}

export function setBalancePending(): types.SetBalancePendingAction {
  return {
    type: constants.WALLET_SET_BALANCE_PENDING,
    payload: { status: { isPending: true } }
  };
}

export type TSetBalance = typeof setBalanceFullfilled;
export function setBalanceFullfilled(
  value: Wei
): types.SetBalanceFullfilledAction {
  return {
    type: constants.WALLET_SET_BALANCE_FULFILLED,
    payload: { value, status: { isPending: false } }
  };
}

export function SetBalanceRejected(): types.SetBalanceRejectedAction {
  return {
    type: constants.WALLET_SET_BALANCE_REJECTED,
    payload: { status: { isPending: false } }
  };
}

export type TSetTokenBalances = typeof setTokenBalances;
export function setTokenBalances(payload: {
  [key: string]: BigNumber;
}): types.SetTokenBalancesAction {
  return {
    type: constants.WALLET_SET_TOKEN_BALANCES,
    payload
  };
}

export type TBroadcastTx = typeof broadcastTx;
export function broadcastTx(
  signedTx: string
): types.BroadcastTxRequestedAction {
  return {
    type: constants.WALLET_BROADCAST_TX_REQUESTED,
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
    type: constants.WALLET_BROADCAST_TX_SUCCEEDED,
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
    type: constants.WALLET_BROADCAST_TX_FAILED,
    payload: {
      signedTx,
      error: errorMsg
    }
  };
}

export type TResetWallet = typeof resetWallet;
export function resetWallet() {
  return {
    type: constants.WALLET_RESET
  };
}
