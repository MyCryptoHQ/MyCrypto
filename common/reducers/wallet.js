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
import { getTxFromTransactionsByRawTx } from 'selectors/wallet';

type Transaction = {
  isBroadcasting: boolean,
  tx: BroadcastTransaction,
  successfullyBroadcast: boolean
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

function handleUpdateTxArray(
  transactions,
  tx,
  isBroadcasting,
  successfullyBroadcast
) {
  return transactions.map(item => {
    if (item === tx) {
      return { ...item, isBroadcasting, successfullyBroadcast };
    } else {
      return { ...item };
    }
  });
}

function handleTxBroadcastCompleted(
  state,
  rawTx,
  successfullyBroadcast
): State {
  const existingTx = getTxFromTransactionsByRawTx(state, rawTx);
  const isBroadcasting = false;
  return handleUpdateTxArray(
    state.transactions,
    existingTx,
    isBroadcasting,
    successfullyBroadcast
  );
}

function handleBroadcastTxRequested(state, rawTx) {
  const existingTx = getTxFromTransactionsByRawTx(state, rawTx);
  const isBroadcasting = true;
  const successfullyBroadcast = false;
  if (!existingTx) {
    return state.transactions.concat([
      {
        tx: rawTx,
        isBroadcasting,
        successfullyBroadcast
      }
    ]);
  } else {
    return handleUpdateTxArray(
      state.transaction,
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
    case 'WALLET_SET_BALANCE':
      return setBalance(state, action);
    case 'WALLET_SET_TOKEN_BALANCES':
      return setTokenBalances(state, action);
    case 'WALLET_BROADCAST_TX_REQUESTED':
      return {
        ...state,
        isBroadcasting: true,
        transactions: handleBroadcastTxRequested(state, action.payload.rawTx)
      };
    case 'WALLET_BROADCAST_TX_SUCCEEDED':
      return {
        ...state,
        transactions: handleTxBroadcastCompleted(
          state,
          action.payload.rawTx,
          true
        )
      };
    case 'WALLET_BROADCAST_TX_FAILED':
      return {
        ...state,
        transactions: handleTxBroadcastCompleted(
          state,
          action.payload.rawTx,
          false
        )
      };
    default:
      return state;
  }
}
