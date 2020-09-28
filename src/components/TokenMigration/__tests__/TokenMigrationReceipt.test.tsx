import React from 'react';

import { MemoryRouter } from 'react-router';
import { simpleRender } from 'test-utils';

import { REPV1UUID } from '@config';
import { repTokenMigrationConfig } from '@features/RepTokenMigration/config';
import { fAccounts, fAssets, fNetwork, fSettings, fTokenMigrationTxs } from '@fixtures';
import { RatesContext } from '@services';
import { DataContext, StoreContext } from '@services/Store';
import { translateRaw } from '@translations';

import TokenMigrationReceipt, {
  TokenMigrationReceiptProps
} from '../components/TokenMigrationReceipt';

const defaultProps: TokenMigrationReceiptProps = {
  tokenMigrationConfig: repTokenMigrationConfig,
  account: fAccounts[0],
  amount: '4',
  transactions: fTokenMigrationTxs(),
  onComplete: jest.fn()
};

function getComponent(props: TokenMigrationReceiptProps) {
  return simpleRender(
    <MemoryRouter initialEntries={undefined}>
      <DataContext.Provider
        value={
          ({
            assets: fAssets,
            settings: fSettings,
            networks: [fNetwork],
            createActions: jest.fn()
          } as unknown) as any
        }
      >
        <RatesContext.Provider
          value={{ rates: {}, getAssetRate: jest.fn(), trackAsset: jest.fn() } as any}
        >
          <StoreContext.Provider
            value={
              ({
                userAssets: [],
                accounts: fAccounts,
                defaultAccount: { assets: [] },
                getAccount: jest.fn(),
                getAssetByUUID: () => fAssets.find(({ uuid }) => uuid === REPV1UUID),
                networks: [{ nodes: [] }]
              } as unknown) as any
            }
          >
            <TokenMigrationReceipt {...((props as unknown) as any)} />
          </StoreContext.Provider>
        </RatesContext.Provider>
      </DataContext.Provider>
    </MemoryRouter>
  );
}

/* Test components */
describe('TokenMigrationReceipt', () => {
  test('Can render the TokenMigrationReceipt', () => {
    const { getByText } = getComponent(defaultProps);
    const selector = translateRaw('TRANSACTION_BROADCASTED_BACK_TO_DASHBOARD');
    expect(getByText(selector)).toBeInTheDocument();
  });
});
