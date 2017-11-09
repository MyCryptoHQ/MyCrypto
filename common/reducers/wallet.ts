import { SetBalanceFullfilledAction } from 'actions/wallet/actionTypes';
import {
  SetTokenBalancesAction,
  SetWalletAction,
  WalletAction
} from 'actions/wallet';
import { BigNumber } from 'bignumber.js';
import { BroadcastTransactionStatus } from 'libs/transaction';
import { IWallet, Balance, NetworkStatus } from 'libs/wallet';
import { getTxFromBroadcastTransactionStatus } from 'selectors/wallet';

export interface State {
  inst?: IWallet | null;
  // in ETH
  balance: Balance | NetworkStatus;
  tokens: {
    [key: string]: BigNumber;
  };
  transactions: BroadcastTransactionStatus[];
}

export const INITIAL_STATE: State = {
  inst: null,
  balance: { isPending: false, unit: null, amount: null },
  tokens: {},
  transactions: []
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

function SetBalanceFullfilled(
  state: State,
  action: SetBalanceFullfilledAction
): State {
  return {
    ...state,
    balance: { ...action.payload.toEther(), isPending: false }
  };
}

function SetBalanceRejected(state: State): State {
  return { ...state, balance: { ...state.balance, isPending: false } };
}

function setTokenBalances(state: State, action: SetTokenBalancesAction): State {
  return { ...state, tokens: { ...state.tokens, ...action.payload } };
}

function handleUpdateTxArray(
  transactions: BroadcastTransactionStatus[],
  broadcastStatusTx: BroadcastTransactionStatus,
  isBroadcasting: boolean,
  successfullyBroadcast: boolean
): BroadcastTransactionStatus[] {
  return transactions.map(item => {
    if (item === broadcastStatusTx) {
      return { ...item, isBroadcasting, successfullyBroadcast };
    } else {
      return { ...item };
    }
  });
}

function handleTxBroadcastCompleted(
  state: State,
  signedTx: string,
  successfullyBroadcast: boolean
): BroadcastTransactionStatus[] {
  const existingTx = getTxFromBroadcastTransactionStatus(
    state.transactions,
    signedTx
  );
  if (existingTx) {
    const isBroadcasting = false;
    return handleUpdateTxArray(
      state.transactions,
      existingTx,
      isBroadcasting,
      successfullyBroadcast
    );
  } else {
    return state.transactions;
  }
}

function handleBroadcastTxRequested(state: State, signedTx: string) {
  const existingTx = getTxFromBroadcastTransactionStatus(
    state.transactions,
    signedTx
  );
  const isBroadcasting = true;
  const successfullyBroadcast = false;
  if (!existingTx) {
    return state.transactions.concat([
      {
        signedTx,
        isBroadcasting,
        successfullyBroadcast
      }
    ]);
  } else {
    return handleUpdateTxArray(
      state.transactions,
      existingTx,
      isBroadcasting,
      successfullyBroadcast
    );
  }
}

export function wallet(
  state: State = INITIAL_STATE,
  action: WalletAction
): State {
  switch (action.type) {
    case 'WALLET_SET':
      return setWallet(state, action);
    case 'WALLET_RESET':
      return INITIAL_STATE;
    case 'WALLET_SET_BALANCE_PENDING':
      return setBalancePending(state);
    case 'WALLET_SET_BALANCE_FULFILLED':
      return SetBalanceFullfilled(state, action);
    case 'WALLET_SET_BALANCE_REJECTED':
      return SetBalanceRejected(state);
    case 'WALLET_SET_TOKEN_BALANCES':
      return setTokenBalances(state, action);
    case 'WALLET_BROADCAST_TX_REQUESTED':
      return {
        ...state,
        transactions: handleBroadcastTxRequested(state, action.payload.signedTx)
      };
    case 'WALLET_BROADCAST_TX_SUCCEEDED':
      return {
        ...state,
        transactions: handleTxBroadcastCompleted(
          state,
          action.payload.signedTx,
          true
        )
      };
    case 'WALLET_BROADCAST_TX_FAILED':
      return {
        ...state,
        transactions: handleTxBroadcastCompleted(
          state,
          action.payload.signedTx,
          false
        )
      };
    default:
      return state;
  }
}
