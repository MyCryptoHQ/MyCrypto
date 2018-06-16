import { translateRaw } from 'translations';
import { IWallet } from 'libs/wallet';
import * as walletTypes from './types';

export const INITIAL_STATE: walletTypes.WalletState = {
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

function setWallet(
  state: walletTypes.WalletState,
  action: walletTypes.SetWalletAction
): walletTypes.WalletState {
  return {
    ...state,
    inst: action.payload,
    config: INITIAL_STATE.config,
    balance: INITIAL_STATE.balance,
    tokens: INITIAL_STATE.tokens,
    recentAddresses: addRecentAddress(state.recentAddresses, action.payload)
  };
}

function setBalancePending(state: walletTypes.WalletState): walletTypes.WalletState {
  return { ...state, balance: { ...state.balance, isPending: true } };
}

function setBalanceFullfilled(
  state: walletTypes.WalletState,
  action: walletTypes.SetBalanceFullfilledAction
): walletTypes.WalletState {
  return {
    ...state,
    balance: { wei: action.payload, isPending: false }
  };
}

function setBalanceRejected(state: walletTypes.WalletState): walletTypes.WalletState {
  return { ...state, balance: { ...state.balance, isPending: false } };
}

function setWalletPending(
  state: walletTypes.WalletState,
  action: walletTypes.SetWalletPendingAction
): walletTypes.WalletState {
  return { ...state, isWalletPending: action.payload };
}

function setPasswordPending(state: walletTypes.WalletState): walletTypes.WalletState {
  return { ...state, isPasswordPending: true };
}

function setTokenBalancesPending(state: walletTypes.WalletState): walletTypes.WalletState {
  return {
    ...state,
    tokens: {},
    isTokensLoading: true,
    tokensError: null
  };
}

function setTokenBalancePending(state: walletTypes.WalletState): walletTypes.WalletState {
  return {
    ...state,
    isTokensLoading: true,
    tokensError: null
  };
}

function setTokenBalanceFufilled(
  state: walletTypes.WalletState,
  action: walletTypes.SetTokenBalanceFulfilledAction
): walletTypes.WalletState {
  return {
    ...state,
    tokens: { ...state.tokens, ...action.payload },
    isTokensLoading: false
  };
}

function setTokenBalanceRejected(state: walletTypes.WalletState): walletTypes.WalletState {
  return {
    ...state,
    isTokensLoading: false,
    tokensError: translateRaw('SCAN_TOKENS_FAIL')
  };
}

function setTokenBalancesFulfilled(
  state: walletTypes.WalletState,
  action: walletTypes.SetTokenBalancesFulfilledAction
): walletTypes.WalletState {
  return {
    ...state,
    tokens: action.payload,
    isTokensLoading: false
  };
}

function setTokenBalancesRejected(state: walletTypes.WalletState): walletTypes.WalletState {
  return {
    ...state,
    isTokensLoading: false,
    tokensError: translateRaw('SCAN_TOKENS_FAIL')
  };
}

function scanWalletForTokens(state: walletTypes.WalletState): walletTypes.WalletState {
  return {
    ...state,
    hasSavedWalletTokens: false
  };
}

function setWalletTokens(state: walletTypes.WalletState): walletTypes.WalletState {
  return {
    ...state,
    hasSavedWalletTokens: true
  };
}

function setWalletConfig(
  state: walletTypes.WalletState,
  action: walletTypes.SetWalletConfigAction
): walletTypes.WalletState {
  return {
    ...state,
    config: action.payload
  };
}

function resetWallet(state: walletTypes.WalletState): walletTypes.WalletState {
  return {
    ...INITIAL_STATE,
    recentAddresses: state.recentAddresses
  };
}

export function walletReducer(
  state: walletTypes.WalletState = INITIAL_STATE,
  action: walletTypes.WalletAction
): walletTypes.WalletState {
  switch (action.type) {
    case walletTypes.WalletActions.SET:
      return setWallet(state, action);
    case walletTypes.WalletActions.RESET:
      return resetWallet(state);
    case walletTypes.WalletActions.SET_BALANCE_PENDING:
      return setBalancePending(state);
    case walletTypes.WalletActions.SET_BALANCE_FULFILLED:
      return setBalanceFullfilled(state, action);
    case walletTypes.WalletActions.SET_BALANCE_REJECTED:
      return setBalanceRejected(state);
    case walletTypes.WalletActions.SET_PENDING:
      return setWalletPending(state, action);
    case walletTypes.WalletActions.SET_TOKEN_BALANCES_PENDING:
      return setTokenBalancesPending(state);
    case walletTypes.WalletActions.SET_TOKEN_BALANCES_FULFILLED:
      return setTokenBalancesFulfilled(state, action);
    case walletTypes.WalletActions.SET_TOKEN_BALANCES_REJECTED:
      return setTokenBalancesRejected(state);
    case walletTypes.WalletActions.SET_TOKEN_BALANCE_PENDING:
      return setTokenBalancePending(state);
    case walletTypes.WalletActions.SET_TOKEN_BALANCE_FULFILLED:
      return setTokenBalanceFufilled(state, action);
    case walletTypes.WalletActions.SET_TOKEN_BALANCE_REJECTED:
      return setTokenBalanceRejected(state);
    case walletTypes.WalletActions.SCAN_WALLET_FOR_TOKENS:
      return scanWalletForTokens(state);
    case walletTypes.WalletActions.SET_WALLET_TOKENS:
      return setWalletTokens(state);
    case walletTypes.WalletActions.SET_CONFIG:
      return setWalletConfig(state, action);
    case walletTypes.WalletActions.SET_PASSWORD_PENDING:
      return setPasswordPending(state);
    default:
      return state;
  }
}
