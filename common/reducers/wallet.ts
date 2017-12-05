import { SetBalanceFullfilledAction } from 'actions/wallet/actionTypes';
import {
  SetTokenBalancesFulfilledAction,
  SetWalletAction,
  WalletAction,
  TypeKeys
} from 'actions/wallet';
import { TokenValue } from 'libs/units';
import { IWallet, Balance } from 'libs/wallet';

export interface State {
  inst?: IWallet | null;
  // in ETH
  balance: Balance | { wei: null };
  tokens: {
    [key: string]: {
      balance: TokenValue;
      error: string | null;
    };
  };
  isTokensLoading: boolean;
  tokensError: string | null;
}

export const INITIAL_STATE: State = {
  inst: null,
  balance: { isPending: false, wei: null },
  tokens: {},
  isTokensLoading: false,
  tokensError: null
};

function setWallet(state: State, action: SetWalletAction): State {
  return {
    ...state,
    inst: action.payload,
    balance: INITIAL_STATE.balance,
    tokens: INITIAL_STATE.tokens
  };
}

function setBalancePending(state: State): State {
  return { ...state, balance: { ...state.balance, isPending: true } };
}

function setBalanceFullfilled(state: State, action: SetBalanceFullfilledAction): State {
  return {
    ...state,
    balance: { wei: action.payload, isPending: false }
  };
}

function setBalanceRejected(state: State): State {
  return { ...state, balance: { ...state.balance, isPending: false } };
}

function setTokenBalancesPending(state: State): State {
  return {
    ...state,
    isTokensLoading: true,
    tokensError: null
  };
}

function setTokenBalancesFulfilled(state: State, action: SetTokenBalancesFulfilledAction): State {
  return {
    ...state,
    tokens: { ...state.tokens, ...action.payload },
    isTokensLoading: false
  };
}

function setTokenBalancesRejected(state: State): State {
  return {
    ...state,
    isTokensLoading: false,
    tokensError: 'Failed to fetch token values'
  };
}

export function wallet(state: State = INITIAL_STATE, action: WalletAction): State {
  switch (action.type) {
    case TypeKeys.WALLET_SET:
      return setWallet(state, action);
    case TypeKeys.WALLET_RESET:
      return INITIAL_STATE;
    case TypeKeys.WALLET_SET_BALANCE_PENDING:
      return setBalancePending(state);
    case TypeKeys.WALLET_SET_BALANCE_FULFILLED:
      return setBalanceFullfilled(state, action);
    case TypeKeys.WALLET_SET_BALANCE_REJECTED:
      return setBalanceRejected(state);
    case TypeKeys.WALLET_SET_TOKEN_BALANCES_PENDING:
      return setTokenBalancesPending(state);
    case TypeKeys.WALLET_SET_TOKEN_BALANCES_FULFILLED:
      return setTokenBalancesFulfilled(state, action);
    case TypeKeys.WALLET_SET_TOKEN_BALANCES_REJECTED:
      return setTokenBalancesRejected(state);
    default:
      return state;
  }
}
