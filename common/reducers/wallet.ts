import { SetBalanceFullfilledAction } from 'actions/wallet/actionTypes';
import {
  SetTokenBalancesFulfilledAction,
  SetWalletAction,
  WalletAction,
  SetWalletConfigAction,
  TypeKeys
} from 'actions/wallet';
import { TokenValue } from 'libs/units';
import { IWallet, Balance, WalletConfig } from 'libs/wallet';

export interface State {
  inst?: IWallet | null;
  config?: WalletConfig | null;
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
  hasSavedWalletTokens: boolean;
}

export const INITIAL_STATE: State = {
  inst: null,
  config: null,
  balance: { isPending: false, wei: null },
  tokens: {},
  isTokensLoading: false,
  tokensError: null,
  hasSavedWalletTokens: true
};

function setWallet(state: State, action: SetWalletAction): State {
  return {
    ...state,
    inst: action.payload,
    config: INITIAL_STATE.config,
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
    tokens: {},
    isTokensLoading: true,
    tokensError: null
  };
}

function setTokenBalancesFulfilled(state: State, action: SetTokenBalancesFulfilledAction): State {
  return {
    ...state,
    tokens: action.payload,
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

function scanWalletForTokens(state: State): State {
  return {
    ...state,
    hasSavedWalletTokens: false
  };
}

function setWalletTokens(state: State): State {
  return {
    ...state,
    hasSavedWalletTokens: true
  };
}

function setWalletConfig(state: State, action: SetWalletConfigAction): State {
  return {
    ...state,
    config: action.payload
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
    case TypeKeys.WALLET_SCAN_WALLET_FOR_TOKENS:
      return scanWalletForTokens(state);
    case TypeKeys.WALLET_SET_WALLET_TOKENS:
      return setWalletTokens(state);
    case TypeKeys.WALLET_SET_CONFIG:
      return setWalletConfig(state, action);
    default:
      return state;
  }
}
