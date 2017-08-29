// @flow
import type {
  WalletAction,
  SetWalletAction,
  SetBalanceAction,
  SetTokenBalancesAction
} from 'actions/wallet';
import { BaseWallet } from 'libs/wallet';
import { toUnit } from 'libs/units';
import Big from 'bignumber.js';
import { BroadcastTransaction } from 'libs/transaction';

type Transaction = {
  isBroadcasting: boolean,
  tx: BroadcastTransaction
};

export type State = {
  inst: ?BaseWallet,
  // in ETH
  balance: Big,
  tokens: {
    [string]: Big
  },
  transactions: Array<Transaction>
};

export const INITIAL_STATE: State = {
  inst: null,
  balance: new Big(0),
  tokens: {},
  isBroadcasting: false,
  transactions: []
};

function setWallet(state: State, action: SetWalletAction): State {
  return { ...state, inst: action.payload, balance: new Big(0), tokens: {} };
}

function setBalance(state: State, action: SetBalanceAction): State {
  const ethBalance = toUnit(action.payload, 'wei', 'ether');
  return { ...state, balance: ethBalance };
}

function setTokenBalances(state: State, action: SetTokenBalancesAction): State {
  return { ...state, tokens: { ...state.tokens, ...action.payload } };
}

export function wallet(
  state: State = INITIAL_STATE,
  action: WalletAction
): State {
  switch (action.type) {
    case 'WALLET_SET':
      return setWallet(state, action);
    case 'WALLET_SET_BALANCE':
      return setBalance(state, action);
    case 'WALLET_SET_TOKEN_BALANCES':
      return setTokenBalances(state, action);
    case 'WALLET_BROADCAST_TX_REQUESTED':
      return {
        ...state,
        isBroadcasting: true
      };
    case 'WALLET_BROADCAST_TX_SUCCEEDED':
      return {
        ...state,
        isBroadcasting: false
      };
    case 'WALLET_BROADCAST_TX_FAILED':
      return {
        ...state,
        isBroadcasting: false
      };
    default:
      return state;
  }
}
