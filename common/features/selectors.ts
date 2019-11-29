import BN from 'bn.js';

import { Wei } from 'libs/units';
import { SecureWalletName, WalletName } from 'config';
import { AppState } from './reducers';
import { ratesSelectors } from './rates';
import * as configMetaSelectors from './config/meta/selectors';
import * as configSelectors from './config/selectors';

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
