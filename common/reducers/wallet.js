// @flow
import type {
  WalletAction,
  SetWalletAction,
  SetBalanceAction,
  SetTokenBalancesAction
} from 'actions/wallet';
import { BaseWallet } from 'libs/wallet';
import { toEther } from 'libs/units';
import Big from 'big.js';

export type State = {
  inst: ?BaseWallet,
  // in ETH
  balance: Big,
  tokens: {
    [string]: Big
  }
};

const initialState: State = {
  inst: null,
  balance: new Big(0),
  tokens: {}
};

function setWallet(state: State, action: SetWalletAction): State {
  return { ...state, inst: action.payload, balance: new Big(0), tokens: {} };
}

function setBalance(state: State, action: SetBalanceAction): State {
  const ethBalance = toEther(action.payload, 'wei');
  return { ...state, balance: ethBalance };
}

function setTokenBalances(state: State, action: SetTokenBalancesAction): State {
  return { ...state, tokens: { ...state.tokens, ...action.payload } };
}

export function wallet(state: State = initialState, action: WalletAction): State {
  switch (action.type) {
    case 'WALLET_SET':
      return setWallet(state, action);
    case 'WALLET_SET_BALANCE':
      return setBalance(state, action);
    case 'WALLET_SET_TOKEN_BALANCES':
      return setTokenBalances(state, action);
    default:
      return state;
  }
}
