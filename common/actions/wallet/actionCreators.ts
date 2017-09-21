import * as types from './actionTypes';
import { BigNumber } from 'bignumber.js';
import { Wei } from 'libs/units';
import { IWallet } from 'libs/wallet/IWallet';
import * as constants from './constants';

export function unlockPrivateKey(
  value: types.PrivateKeyUnlockParams
): types.UnlockPrivateKeyAction {
  return {
    type: constants.WALLET_UNLOCK_PRIVATE_KEY,
    payload: value
  };
}

export function unlockKeystore(
  value: types.KeystoreUnlockParams
): types.UnlockKeystoreAction {
  return {
    type: constants.WALLET_UNLOCK_KEYSTORE,
    payload: value
  };
}

export function unlockMnemonic(
  value: types.MnemonicUnlockParams
): types.UnlockMnemonicAction {
  return {
    type: constants.WALLET_UNLOCK_MNEMONIC,
    payload: value
  };
}

export function setWallet(value: IWallet): types.SetWalletAction {
  return {
    type: constants.WALLET_SET,
    payload: value
  };
}

export function setBalance(value: Wei): types.SetBalanceAction {
  return {
    type: constants.WALLET_SET_BALANCE,
    payload: value
  };
}

export function setTokenBalances(payload: {
  [key: string]: BigNumber;
}): types.SetTokenBalancesAction {
  return {
    type: constants.WALLET_SET_TOKEN_BALANCES,
    payload
  };
}

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
