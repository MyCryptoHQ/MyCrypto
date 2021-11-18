import { WalletConnectivity, wallets } from '@mycrypto/wallet-list';

import { getMigrationGuide } from '../config';

describe('getMigrationGuide()', () => {
  it('can return migration config', () => {
    const custodialExchange = wallets.find(
      (wallet) => wallet.connectivity === WalletConnectivity.MigrateCustodial
    );

    const nonCustodialExchange = wallets.find(
      (wallet) => wallet.connectivity === WalletConnectivity.MigrateNonCustodial
    );

    expect(getMigrationGuide(custodialExchange!)).toBeTruthy();
    expect(getMigrationGuide(nonCustodialExchange!)).toBeTruthy();
  });
});
