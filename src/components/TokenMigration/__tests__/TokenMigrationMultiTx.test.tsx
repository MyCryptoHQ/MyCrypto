import React from 'react';

import { MemoryRouter } from 'react-router';
import { simpleRender } from 'test-utils';

import { repTokenMigrationConfig } from '@features/RepTokenMigration/config';
import { fNetwork, fSettings, fTokenMigrationTxs } from '@fixtures';
import { FeatureFlagProvider } from '@services';
import { DataContext, StoreContext } from '@services/Store';

import ConfirmTokenMigration, {
  TokenMigrationMultiTxConfirmProps
} from '../components/TokenMigrationMultiTx';

const defaultProps: TokenMigrationMultiTxConfirmProps = {
  tokenMigrationConfig: repTokenMigrationConfig,
  currentTxIdx: 0,
  transactions: fTokenMigrationTxs(),
  onComplete: jest.fn()
};

function getComponent(props: TokenMigrationMultiTxConfirmProps) {
  return simpleRender(
    <MemoryRouter initialEntries={undefined}>
      <DataContext.Provider
        value={
          ({
            assets: [{ uuid: fNetwork.baseAsset }],
            settings: fSettings,
            networks: [fNetwork],
            createActions: jest.fn()
          } as unknown) as any
        }
      >
        <FeatureFlagProvider>
          <StoreContext.Provider
            value={
              ({
                userAssets: [],
                accounts: [],
                defaultAccount: { assets: [] },
                getAccount: jest.fn(),
                networks: [{ nodes: [] }]
              } as unknown) as any
            }
          >
            <ConfirmTokenMigration {...((props as unknown) as any)} />
          </StoreContext.Provider>
        </FeatureFlagProvider>
      </DataContext.Provider>
    </MemoryRouter>
  );
}

/* Test components */
describe('TokenMigrationMultiTx', () => {
  test('Can render the TokenMigrationMultiTx confirm panel', () => {
    const { getByText } = getComponent(defaultProps);
    const selector =
      defaultProps.tokenMigrationConfig.txConstructionConfigs[defaultProps.currentTxIdx]
        .stepContent;
    expect(getByText(selector)).toBeInTheDocument();
  });
});
