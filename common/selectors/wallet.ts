import { TokenValue } from 'libs/units';
import { Token } from 'config/data';
import { IWallet } from 'libs/wallet';
import { AppState } from 'reducers';
import { getNetworkConfig } from 'selectors/config';

export function getWalletInst(state: AppState): IWallet | null | undefined {
  return state.wallet.inst;
}

export interface TokenBalance {
  symbol: string;
  balance: TokenValue;
  custom: boolean;
  decimal: number;
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
      : TokenValue('0'),
    custom: t.custom,
    decimal: t.decimal
  }));
}
