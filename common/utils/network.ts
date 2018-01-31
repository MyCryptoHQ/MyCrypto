import { InsecureWalletName, SecureWalletName, WalletName, walletNames } from 'config';
import { EXTRA_PATHS } from 'config/dpaths';
import sortedUniq from 'lodash/sortedUniq';
import difference from 'lodash/difference';
import { CustomNetworkConfig } from 'types/network';

export function makeCustomNetworkId(config: CustomNetworkConfig): string {
  return config.chainId ? `${config.chainId}` : `${config.name}:${config.unit}`;
}
