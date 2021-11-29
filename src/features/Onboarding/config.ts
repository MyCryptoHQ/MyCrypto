import { IWallet, WalletConnectivity } from '@mycrypto/wallet-list';

import { ROUTE_PATHS } from '@config';
import { translateRaw } from '@translations';

export const getMigrationGuide = (wallet: IWallet) => {
  if (wallet.connectivity === WalletConnectivity.MigrateCustodial)
    return {
      subheading: translateRaw('MIGRATE_CUSTODIAL_SUBHEADING', { $exchange: wallet.name }),
      topButton: {
        to: ROUTE_PATHS.DOWNLOAD_DESKTOP_APP.path,
        text: translateRaw('BUSY_BOTTOM_GENERAL_1')
      },
      primaryButton: {
        to: ROUTE_PATHS.DOWNLOAD_DESKTOP_APP.path,
        text: translateRaw('BUSY_BOTTOM_GENERAL_1')
      },
      secondaryButton: {
        to: ROUTE_PATHS.ADD_ACCOUNT.path,
        text: translateRaw('MIGRATE_CONNECT_ACCOUNT')
      },
      steps: [
        translateRaw('MIGRATE_CUSTODIAL_01'),
        translateRaw('MIGRATE_CUSTODIAL_02', { $exchange: wallet.name }),
        translateRaw('MIGRATE_CUSTODIAL_03')
      ]
    };
  if (wallet.connectivity === WalletConnectivity.MigrateNonCustodial)
    return {
      subheading: translateRaw('MIGRATE_NON_CUSTODIAL_SUBHEADING', { $exchange: wallet.name }),
      topButton: {
        to: `${ROUTE_PATHS.ADD_ACCOUNT.path}/${wallet.id}`,
        text: translateRaw('MIGRATE_NON_CUSTODIAL_TOP_BUTTON', { $exchange: wallet.name })
      },
      primaryButton: {
        to: ROUTE_PATHS.DOWNLOAD_DESKTOP_APP.path,
        text: translateRaw('BUSY_BOTTOM_GENERAL_1')
      },
      secondaryButton: {
        to: ROUTE_PATHS.ADD_ACCOUNT.path,
        text: translateRaw('MIGRATE_CONNECT_ACCOUNT')
      },
      steps: [
        translateRaw('MIGRATE_NON_CUSTODIAL_01', { $exchange: wallet.name }),
        translateRaw('MIGRATE_NON_CUSTODIAL_02'),
        translateRaw('MIGRATE_NON_CUSTODIAL_03', { $exchange: wallet.name })
      ]
    };
};
