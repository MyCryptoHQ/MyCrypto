import { translateRaw } from 'translations';
import { IWallet } from 'libs/wallet';
import * as types from './types';

export const INITIAL_STATE: types.WalletState = {
  inst: null,
  config: null,
  balance: { isPending: false, wei: null },
  tokens: {},
  isWalletPending: false,
  isPasswordPending: false,
  isTokensLoading: false,
  tokensError: null,
  hasSavedWalletTokens: true,
  recentAddresses: [],
  accessMessage: 'Wo'
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

function setWallet(state: types.WalletState, action: types.SetWalletAction): types.WalletState {
  return {
    ...state,
    inst: action.payload,
    config: INITIAL_STATE.config,
    balance: INITIAL_STATE.balance,
    tokens: INITIAL_STATE.tokens,
    recentAddresses: addRecentAddress(state.recentAddresses, action.payload)
  };
}

function setBalancePending(state: types.WalletState): types.WalletState {
  return { ...state, balance: { ...state.balance, isPending: true } };
}

function setBalanceFullfilled(
  state: types.WalletState,
  action: types.SetBalanceFullfilledAction
): types.WalletState {
  return {
    ...state,
    balance: { wei: action.payload, isPending: false }
  };
}

function setBalanceRejected(state: types.WalletState): types.WalletState {
  return { ...state, balance: { ...state.balance, isPending: false } };
}

function setWalletPending(
  state: types.WalletState,
  action: types.SetWalletPendingAction
): types.WalletState {
  return { ...state, isWalletPending: action.payload };
}

function setPasswordPending(state: types.WalletState): types.WalletState {
  return { ...state, isPasswordPending: true };
}

function setTokenBalancesPending(state: types.WalletState): types.WalletState {
  return {
    ...state,
    tokens: {},
    isTokensLoading: true,
    tokensError: null
  };
}

function setTokenBalancePending(state: types.WalletState): types.WalletState {
  return {
    ...state,
    isTokensLoading: true,
    tokensError: null
  };
}

function setTokenBalanceFufilled(
  state: types.WalletState,
  action: types.SetTokenBalanceFulfilledAction
): types.WalletState {
  return {
    ...state,
    tokens: { ...state.tokens, ...action.payload },
    isTokensLoading: false
  };
}

function setTokenBalanceRejected(state: types.WalletState): types.WalletState {
  return {
    ...state,
    isTokensLoading: false,
    tokensError: translateRaw('SCAN_TOKENS_FAIL')
  };
}

function setTokenBalancesFulfilled(
  state: types.WalletState,
  action: types.SetTokenBalancesFulfilledAction
): types.WalletState {
  return {
    ...state,
    tokens: action.payload,
    isTokensLoading: false
  };
}

function setTokenBalancesRejected(state: types.WalletState): types.WalletState {
  return {
    ...state,
    isTokensLoading: false,
    tokensError: translateRaw('SCAN_TOKENS_FAIL')
  };
}

function scanWalletForTokens(state: types.WalletState): types.WalletState {
  return {
    ...state,
    hasSavedWalletTokens: false
  };
}

function setWalletTokens(state: types.WalletState): types.WalletState {
  return {
    ...state,
    hasSavedWalletTokens: true
  };
}

function setWalletConfig(
  state: types.WalletState,
  action: types.SetWalletConfigAction
): types.WalletState {
  return {
    ...state,
    config: action.payload
  };
}

function resetWallet(state: types.WalletState): types.WalletState {
  return {
    ...INITIAL_STATE,
    recentAddresses: state.recentAddresses
  };
}

function setAccessMessage(
  state: types.WalletState,
  action: types.SetAccessMessageAction
): types.WalletState {
  return {
    ...state,
    accessMessage: action.payload
  };
}

export function walletReducer(
  state: types.WalletState = INITIAL_STATE,
  action: types.WalletAction
): types.WalletState {
  switch (action.type) {
    case types.WalletActions.SET:
      return setWallet(state, action);
    case types.WalletActions.RESET:
      return resetWallet(state);
    case types.WalletActions.SET_BALANCE_PENDING:
      return setBalancePending(state);
    case types.WalletActions.SET_BALANCE_FULFILLED:
      return setBalanceFullfilled(state, action);
    case types.WalletActions.SET_BALANCE_REJECTED:
      return setBalanceRejected(state);
    case types.WalletActions.SET_PENDING:
      return setWalletPending(state, action);
    case types.WalletActions.SET_TOKEN_BALANCES_PENDING:
      return setTokenBalancesPending(state);
    case types.WalletActions.SET_TOKEN_BALANCES_FULFILLED:
      return setTokenBalancesFulfilled(state, action);
    case types.WalletActions.SET_TOKEN_BALANCES_REJECTED:
      return setTokenBalancesRejected(state);
    case types.WalletActions.SET_TOKEN_BALANCE_PENDING:
      return setTokenBalancePending(state);
    case types.WalletActions.SET_TOKEN_BALANCE_FULFILLED:
      return setTokenBalanceFufilled(state, action);
    case types.WalletActions.SET_TOKEN_BALANCE_REJECTED:
      return setTokenBalanceRejected(state);
    case types.WalletActions.SCAN_WALLET_FOR_TOKENS:
      return scanWalletForTokens(state);
    case types.WalletActions.SET_WALLET_TOKENS:
      return setWalletTokens(state);
    case types.WalletActions.SET_CONFIG:
      return setWalletConfig(state, action);
    case types.WalletActions.SET_PASSWORD_PENDING:
      return setPasswordPending(state);
    case types.WalletActions.SET_ACCESS_MESSAGE:
      return setAccessMessage(state, action);
    default:
      return state;
  }
}
