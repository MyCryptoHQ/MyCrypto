// @flow
import type { State } from 'reducers';
import { BaseWallet } from 'libs/wallet';
import { getNetworkConfig } from 'selectors/config';
import Big from 'bignumber.js';
import type { Token } from 'config/data';
import type { BroadcastStatusTransaction } from 'libs/transaction';

export function getWalletInst(state: State): ?BaseWallet {
  return state.wallet.inst;
}

export type TokenBalance = {
  symbol: string,
  balance: Big,
  custom: boolean
};

type MergedToken = Token & {
  custom: boolean
};

export function getTokens(state: State): MergedToken[] {
  const tokens: MergedToken[] = (getNetworkConfig(state).tokens: any);
  return tokens.concat(
    state.customTokens.map(token => ({ ...token, custom: true }))
  );
}

export function getTokenBalances(state: State): TokenBalance[] {
  const tokens = getTokens(state);
  if (!tokens) {
    return [];
  }
  return tokens.map(t => ({
    symbol: t.symbol,
    balance: state.wallet.tokens[t.symbol]
      ? state.wallet.tokens[t.symbol]
      : new Big(0),
    custom: t.custom
  }));
}

export function getTxFromTransactionsBySignedTx(
  state: State,
  signedTx: string
): ?BroadcastStatusTransaction {
  const transactions = state.wallet.transactions;
  const matchingTxs = transactions.filter(function(obj) {
    return obj.signedTx === signedTx;
  });
  return matchingTxs ? matchingTxs[0] : null;
}

// TODO type signedTx?
export function getTxFromBroadcastStatusTransactions(
  transactions: Array<BroadcastStatusTransaction>,
  signedTx: string
): ?BroadcastStatusTransaction {
  const matchingTxs = transactions.filter(function(obj) {
    return obj.signedTx === signedTx;
  });
  return matchingTxs ? matchingTxs[0] : null;
}
