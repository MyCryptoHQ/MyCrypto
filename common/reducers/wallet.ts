import {
  SetBalanceAction,
  SetTokenBalancesAction,
  SetWalletAction,
  WalletAction,
  TypeKeys
} from 'actions/wallet';
import { Wei, TokenValue } from 'libs/units';
import { IWallet } from 'libs/wallet';

export interface State {
  inst?: IWallet | null;
  // in ETH
  balance?: Wei | null;
  tokens: {
    [key: string]: TokenValue;
  };
}

export const INITIAL_STATE: State = {
  inst: null,
  balance: null,
  tokens: {}
};

function setWallet(state: State, action: SetWalletAction): State {
  return { ...state, inst: action.payload, balance: null, tokens: {} };
}

function setBalance(state: State, action: SetBalanceAction): State {
  const weiBalance = action.payload;
  return { ...state, balance: weiBalance };
}

function setTokenBalances(state: State, action: SetTokenBalancesAction): State {
  return { ...state, tokens: { ...state.tokens, ...action.payload } };
}

export function wallet(
  state: State = INITIAL_STATE,
  action: WalletAction
): State {
  switch (action.type) {
    case TypeKeys.WALLET_SET:
      return setWallet(state, action);
    case TypeKeys.WALLET_RESET:
      return INITIAL_STATE;
    case TypeKeys.WALLET_SET_BALANCE:
      return setBalance(state, action);
    case TypeKeys.WALLET_SET_TOKEN_BALANCES:
      return setTokenBalances(state, action);
    default:
      return state;
  }
}
