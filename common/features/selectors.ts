import BN from 'bn.js';

import { Wei, TokenValue } from 'libs/units';
import { SecureWalletName, WalletName } from 'config';
import { Token } from 'types/network';
import { AppState } from './reducers';
import { walletTypes, walletSelectors } from './wallet';
import { ratesSelectors } from './rates';
import * as configMetaSelectors from './config/meta/selectors';
import * as configSelectors from './config/selectors';

export const isAnyOfflineWithWeb3 = (state: AppState): boolean => {
  const { isWeb3Wallet } = walletSelectors.getWalletType(state);
  const offline = configMetaSelectors.getOffline(state);
  return offline && isWeb3Wallet;
};

// TODO: Convert to reselect selector (Issue #884)
export function getDisabledWallets(state: AppState): any {
  const network = configSelectors.getNetworkConfig(state);
  const isOffline = configMetaSelectors.getOffline(state);
  const disabledWallets: any = {
    wallets: [],
    reasons: {}
  };

  const addReason = (wallets: WalletName[], reason: string) => {
    if (!wallets.length) {
      return;
    }

    disabledWallets.wallets = disabledWallets.wallets.concat(wallets);
    wallets.forEach(wallet => {
      disabledWallets.reasons[wallet] = reason;
    });
  };

  // Some wallets don't support some networks
  addReason(
    configSelectors.unSupportedWalletFormatsOnNetwork(state),
    `This wallet doesn’t support the ${network.name} network`
  );

  // Some wallets are unavailable offline
  if (isOffline) {
    addReason(
      [SecureWalletName.WEB3, SecureWalletName.TREZOR, SecureWalletName.SAFE_T],
      'This wallet cannot be accessed offline'
    );
  }

  // Some wallets are disabled on certain platforms
  if (process.env.BUILD_ELECTRON) {
    addReason([SecureWalletName.WEB3], 'This wallet is not supported in the MyCrypto app');
    addReason(
      [SecureWalletName.SAFE_T],
      'Coming soon. Please use the MyCrypto.com website in the meantime'
    );
  }

  // Dedupe and sort for consistency
  disabledWallets.wallets = disabledWallets.wallets
    .filter((name: string, idx: number) => disabledWallets.wallets.indexOf(name) === idx)
    .sort();

  return disabledWallets;
}

export function getTokens(state: AppState): walletTypes.MergedToken[] {
  const network = configSelectors.getStaticNetworkConfig(state);
  const tokens: Token[] = network ? network.tokens : [];
  return tokens.concat(
    state.customTokens.map((token: Token) => {
      const mergedToken = { ...token, custom: true };
      return mergedToken;
    })
  ) as walletTypes.MergedToken[];
}

export function getWalletConfigTokens(state: AppState): walletTypes.MergedToken[] {
  const tokens = getTokens(state);
  const config = walletSelectors.getWalletConfig(state);
  if (!config || !config.tokens) {
    return [];
  }
  return config.tokens
    .map(symbol => tokens.find(t => t.symbol === symbol))
    .filter(token => token) as walletTypes.MergedToken[];
}

export const getToken = (state: AppState, unit: string): walletTypes.MergedToken | undefined => {
  const tokens = getTokens(state);
  const token = tokens.find(t => t.symbol === unit);
  return token;
};

export function getTokenBalances(
  state: AppState,
  nonZeroOnly: boolean = false
): walletTypes.TokenBalance[] {
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

export const getTokenWithBalance = (state: AppState, unit: string): walletTypes.TokenBalance => {
  const tokens = getTokenBalances(state, false);
  const currentToken = tokens.filter(t => t.symbol === unit);
  //TODO: getting the first index is kinda hacky
  return currentToken[0];
};

export const getTokenBalance = (state: AppState, unit: string): TokenValue | null => {
  const token = getTokenWithBalance(state, unit);
  if (!token) {
    return token;
  }
  return token.balance;
};

export function getShownTokenBalances(
  state: AppState,
  nonZeroOnly: boolean = false
): walletTypes.TokenBalance[] {
  const tokenBalances = getTokenBalances(state, nonZeroOnly);
  const walletConfig = walletSelectors.getWalletConfig(state);

  let walletTokens: string[] = [];
  if (walletConfig) {
    if (walletConfig.tokens) {
      walletTokens = walletConfig.tokens;
    }
  }

  return tokenBalances.filter(t => walletTokens.includes(t.symbol));
}

const getUSDConversionRate = (state: AppState, unit: string) => {
  const { isTestnet, hideEquivalentValues } = configSelectors.getNetworkConfig(state);
  const { rates } = ratesSelectors.getRates(state);
  if (isTestnet || hideEquivalentValues) {
    return null;
  }

  const conversionRate = rates[unit];

  if (!conversionRate) {
    return null;
  }
  return conversionRate.USD;
};

export const getTransactionFeeInUSD = (state: AppState, fee: Wei) => {
  const { unit } = configSelectors.getNetworkConfig(state);
  const conversionRate = getUSDConversionRate(state, unit);

  if (!conversionRate) {
    return null;
  }

  const feeValueUSD = fee.muln(conversionRate);
  return feeValueUSD;
};

export interface AllUSDValues {
  valueUSD: BN | null;
  feeUSD: BN | null;
  totalUSD: BN | null;
}
