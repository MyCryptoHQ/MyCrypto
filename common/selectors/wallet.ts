import { TokenValue, Wei } from 'libs/units';
import { Token } from 'config/data';
import { AppState } from 'reducers';
import { getNetworkConfig } from 'selectors/config';
import { IWallet, Web3Wallet, LedgerWallet, TrezorWallet, WalletConfig } from 'libs/wallet';
import { isEtherTransaction, getUnit } from './transaction';

export function getWalletInst(state: AppState): IWallet | null | undefined {
  return state.wallet.inst;
}

export function getWalletConfig(state: AppState): WalletConfig | null | undefined {
  return state.wallet.config;
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

export function getWalletConfigTokens(state: AppState): MergedToken[] {
  const tokens = getTokens(state);
  const config = getWalletConfig(state);
  if (!config || !config.tokens) {
    return [];
  }
  return config.tokens
    .map(symbol => tokens.find(t => t.symbol === symbol))
    .filter(token => token) as MergedToken[];
}

export const getToken = (state: AppState, unit: string): MergedToken | undefined => {
  const tokens = getTokens(state);
  const token = tokens.find(t => t.symbol === unit);
  return token;
};

export function getTokenBalances(state: AppState, nonZeroOnly: boolean = false): TokenBalance[] {
  const tokens = getTokens(state);
  if (!tokens) {
    return [];
  }
  const ret = tokens.map(t => ({
    symbol: t.symbol,
    balance: state.wallet.tokens[t.symbol]
      ? state.wallet.tokens[t.symbol].balance
      : TokenValue('0'),
    error: state.wallet.tokens[t.symbol] ? state.wallet.tokens[t.symbol].error : null,
    custom: t.custom,
    decimal: t.decimal
  }));

  return nonZeroOnly ? ret.filter(t => !t.balance.isZero()) : ret;
}

export const getTokenBalance = (state: AppState, unit: string): TokenValue | null => {
  const token = getTokenWithBalance(state, unit);
  if (!token) {
    return token;
  }
  return token.balance;
};

export const getTokenWithBalance = (state: AppState, unit: string): TokenBalance => {
  const tokens = getTokenBalances(state, false);
  const currentToken = tokens.filter(t => t.symbol === unit);
  //TODO: getting the first index is kinda hacky
  return currentToken[0];
};

export interface IWalletType {
  isWeb3Wallet: boolean;
  isHardwareWallet: boolean;
}

export const getWallet = (state: AppState) => state.wallet;

export const getWalletType = (state: AppState): IWalletType => {
  const wallet = getWalletInst(state);
  const isWeb3Wallet = wallet instanceof Web3Wallet;
  const isLedgerWallet = wallet instanceof LedgerWallet;
  const isTrezorWallet = wallet instanceof TrezorWallet;
  const isHardwareWallet = isLedgerWallet || isTrezorWallet;
  return { isWeb3Wallet, isHardwareWallet };
};

export const isUnlocked = (state: AppState) => !!getWalletInst(state);

export const getEtherBalance = (state: AppState): Wei | null => getWallet(state).balance.wei;

export const getCurrentBalance = (state: AppState): Wei | TokenValue | null => {
  const etherTransaction = isEtherTransaction(state);
  if (etherTransaction) {
    return getEtherBalance(state);
  } else {
    const unit = getUnit(state);
    return getTokenBalance(state, unit);
  }
};

export function getShownTokenBalances(
  state: AppState,
  nonZeroOnly: boolean = false
): TokenBalance[] {
  const tokenBalances = getTokenBalances(state, nonZeroOnly);
  const walletConfig = getWalletConfig(state);

  let walletTokens: string[] = [];
  if (walletConfig) {
    if (walletConfig.tokens) {
      walletTokens = walletConfig.tokens;
    }
  }

  return tokenBalances.filter(t => walletTokens.includes(t.symbol));
}
