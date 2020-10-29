import React from 'react';

import { MemoryRouter } from 'react-router';
import { simpleRender } from 'test-utils';

import { repTokenMigrationConfig } from '@features/RepTokenMigration/config';
import { fNetwork, fSettings, fTokenMigrationTxs } from '@fixtures';
import { FeatureFlagProvider } from '@services';
import { DataContext, StoreContext } from '@services/Store';
import { ITokenMigrationConfig, ITxMultiConfirmProps } from '@types';

import ConfirmTokenMigration from '../components/TokenMigrationMultiTx';

const defaultProps: ITxMultiConfirmProps = {
  flowConfig: repTokenMigrationConfig,
  currentTxIdx: 0,
  transactions: fTokenMigrationTxs(),
  onComplete: jest.fn()
};

function getComponent(props: ITxMultiConfirmProps) {
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
    const selector = (defaultProps.flowConfig as ITokenMigrationConfig).txConstructionConfigs[
      defaultProps.currentTxIdx
    ].stepContent;
    expect(getByText(selector)).toBeInTheDocument();
  });
});
