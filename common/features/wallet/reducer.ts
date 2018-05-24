import { translateRaw } from 'translations';
import { IWallet } from 'libs/wallet';

import {
  WALLET,
  SetTokenBalancesFulfilledAction,
  SetWalletAction,
  WalletAction,
  SetWalletConfigAction,
  SetWalletPendingAction,
  SetTokenBalanceFulfilledAction,
  SetBalanceFullfilledAction,
  WalletState
} from './types';

export const INITIAL_STATE: WalletState = {
  inst: null,
  config: null,
  balance: { isPending: false, wei: null },
  tokens: {},
  isWalletPending: false,
  isPasswordPending: false,
  isTokensLoading: false,
  tokensError: null,
  hasSavedWalletTokens: true,
  recentAddresses: []
};

export const RECENT_ADDRESS_LIMIT = 10;

function addRecentAddress(addresses: string[], newWallet: IWallet | null) {
  if (!newWallet) {
    return addresses;
  }
  // Push new address onto the front
  const newAddresses = [newWallet.getAddressString(), ...addresses];
  // Dedupe addresses, limit length
  return newAddresses
    .filter((addr, idx) => newAddresses.indexOf(addr) === idx)
    .splice(0, RECENT_ADDRESS_LIMIT);
}

function setWallet(state: WalletState, action: SetWalletAction): WalletState {
  return {
    ...state,
    inst: action.payload,
    config: INITIAL_STATE.config,
    balance: INITIAL_STATE.balance,
    tokens: INITIAL_STATE.tokens,
    recentAddresses: addRecentAddress(state.recentAddresses, action.payload)
  };
}

function setBalancePending(state: WalletState): WalletState {
  return { ...state, balance: { ...state.balance, isPending: true } };
}

function setBalanceFullfilled(state: WalletState, action: SetBalanceFullfilledAction): WalletState {
  return {
    ...state,
    balance: { wei: action.payload, isPending: false }
  };
}

function setBalanceRejected(state: WalletState): WalletState {
  return { ...state, balance: { ...state.balance, isPending: false } };
}

function setWalletPending(state: WalletState, action: SetWalletPendingAction): WalletState {
  return { ...state, isWalletPending: action.payload };
}

function setPasswordPending(state: WalletState): WalletState {
  return { ...state, isPasswordPending: true };
}

function setTokenBalancesPending(state: WalletState): WalletState {
  return {
    ...state,
    tokens: {},
    isTokensLoading: true,
    tokensError: null
  };
}

function setTokenBalancePending(state: WalletState): WalletState {
  return {
    ...state,
    isTokensLoading: true,
    tokensError: null
  };
}

function setTokenBalanceFufilled(
  state: WalletState,
  action: SetTokenBalanceFulfilledAction
): WalletState {
  return {
    ...state,
    tokens: { ...state.tokens, ...action.payload },
    isTokensLoading: false
  };
}

function setTokenBalanceRejected(state: WalletState): WalletState {
  return {
    ...state,
    isTokensLoading: false,
    tokensError: translateRaw('SCAN_TOKENS_FAIL')
  };
}

function setTokenBalancesFulfilled(
  state: WalletState,
  action: SetTokenBalancesFulfilledAction
): WalletState {
  return {
    ...state,
    tokens: action.payload,
    isTokensLoading: false
  };
}

function setTokenBalancesRejected(state: WalletState): WalletState {
  return {
    ...state,
    isTokensLoading: false,
    tokensError: translateRaw('SCAN_TOKENS_FAIL')
  };
}

function scanWalletForTokens(state: WalletState): WalletState {
  return {
    ...state,
    hasSavedWalletTokens: false
  };
}

function setWalletTokens(state: WalletState): WalletState {
  return {
    ...state,
    hasSavedWalletTokens: true
  };
}

function setWalletConfig(state: WalletState, action: SetWalletConfigAction): WalletState {
  return {
    ...state,
    config: action.payload
  };
}

function resetWallet(state: WalletState): WalletState {
  return {
    ...INITIAL_STATE,
    recentAddresses: state.recentAddresses
  };
}

export function walletReducer(
  state: WalletState = INITIAL_STATE,
  action: WalletAction
): WalletState {
  switch (action.type) {
    case WALLET.SET:
      return setWallet(state, action);
    case WALLET.RESET:
      return resetWallet(state);
    case WALLET.SET_BALANCE_PENDING:
      return setBalancePending(state);
    case WALLET.SET_BALANCE_FULFILLED:
      return setBalanceFullfilled(state, action);
    case WALLET.SET_BALANCE_REJECTED:
      return setBalanceRejected(state);
    case WALLET.SET_PENDING:
      return setWalletPending(state, action);
    case WALLET.SET_TOKEN_BALANCES_PENDING:
      return setTokenBalancesPending(state);
    case WALLET.SET_TOKEN_BALANCES_FULFILLED:
      return setTokenBalancesFulfilled(state, action);
    case WALLET.SET_TOKEN_BALANCES_REJECTED:
      return setTokenBalancesRejected(state);
    case WALLET.SET_TOKEN_BALANCE_PENDING:
      return setTokenBalancePending(state);
    case WALLET.SET_TOKEN_BALANCE_FULFILLED:
      return setTokenBalanceFufilled(state, action);
    case WALLET.SET_TOKEN_BALANCE_REJECTED:
      return setTokenBalanceRejected(state);
    case WALLET.SCAN_WALLET_FOR_TOKENS:
      return scanWalletForTokens(state);
    case WALLET.SET_WALLET_TOKENS:
      return setWalletTokens(state);
    case WALLET.SET_CONFIG:
      return setWalletConfig(state, action);
    case WALLET.SET_PASSWORD_PENDING:
      return setPasswordPending(state);
    default:
      return state;
  }
}
