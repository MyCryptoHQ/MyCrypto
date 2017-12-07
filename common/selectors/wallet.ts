import { TokenValue } from 'libs/units';
import { Token } from 'config/data';

import { AppState } from 'reducers';
import { getNetworkConfig } from 'selectors/config';
import { IWallet, Web3Wallet, LedgerWallet, TrezorWallet, WalletConfig } from 'libs/wallet';

export function getWalletInst(state: AppState): IWallet | null | undefined {
  return state.wallet.inst;
}

export function getWalletConfig(state: AppState): WalletConfig | null | undefined {
  return state.wallet.config;
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

export const getWalletType = (state: AppState) => {
  const wallet = getWalletInst(state);
  const isWeb3Wallet = wallet instanceof Web3Wallet;
  const isLedgerWallet = wallet instanceof LedgerWallet;
  const isTrezorWallet = wallet instanceof TrezorWallet;
  const isHardwareWallet = isLedgerWallet || isTrezorWallet;
  return { isWeb3Wallet, isHardwareWallet };
};
