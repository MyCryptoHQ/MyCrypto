import { TokenValue } from 'libs/units';
import { Token } from 'config/data';
import { BroadcastTransactionStatus } from 'libs/transaction';
import { IWallet } from 'libs/wallet';
import { AppState } from 'reducers';
import { getNetworkConfig } from 'selectors/config';

export function getWalletInst(state: AppState): IWallet | null | undefined {
  return state.wallet.inst;
}

export function isWalletFullyUnlocked(state: AppState): boolean | null | undefined {
  return state.wallet.inst && !state.wallet.inst.isReadOnly;
}

export interface TokenBalance {
  symbol: string;
  balance: TokenValue;
  custom: boolean;
  decimal: number;
  error: string | null;
}

export type MergedToken = Token & {
  custom: boolean;
};

export function getTokens(state: AppState): MergedToken[] {
  const network = getNetworkConfig(state);
  const tokens: Token[] = network ? network.tokens : [];
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
      ? state.wallet.tokens[t.symbol].balance
      : TokenValue('0'),
    error: state.wallet.tokens[t.symbol] ? state.wallet.tokens[t.symbol].error : null,
    custom: t.custom,
    decimal: t.decimal
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
  const tx = transactions.find(transaction => transaction.signedTx === signedTx);
  return tx || null;
}
