import Big, { BigNumber } from 'bignumber.js';
import { Token } from 'config/data';
import { BroadcastTransactionStatus } from 'libs/transaction';
import { IWallet } from 'libs/wallet';
import { AppState } from 'reducers';
import { getNetworkConfig } from 'selectors/config';

export function getWalletInst(state: AppState): IWallet | null | undefined {
  return state.wallet.inst;
}

export interface TokenBalance {
  symbol: string;
  balance: BigNumber;
  custom: boolean;
}

export type MergedToken = Token & {
  custom: boolean;
};

export function getTokens(state: AppState): MergedToken[] {
  const tokens: Token[] = getNetworkConfig(state).tokens;
  return tokens.concat(
    state.customTokens.map((token: Token) => {
      const mergedToken = { ...token, custom: true };
      return mergedToken;
    })
  ) as MergedToken[];
}

export function getTokenBalances(state: AppState): TokenBalance[] {
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

export function getTxFromState(
  state: AppState,
  signedTx: string
): BroadcastTransactionStatus | null {
  const transactions = state.wallet.transactions;
  return getTxFromBroadcastTransactionStatus(transactions, signedTx);
}

export function getTxFromBroadcastTransactionStatus(
  transactions: BroadcastTransactionStatus[],
  signedTx: string
): BroadcastTransactionStatus | null {
  const tx = transactions.find(
    transaction => transaction.signedTx === signedTx
  );
  return tx || null;
}
