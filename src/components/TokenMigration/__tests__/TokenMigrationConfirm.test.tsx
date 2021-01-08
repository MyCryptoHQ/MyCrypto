import React from 'react';

import { MemoryRouter } from 'react-router';
import { simpleRender } from 'test-utils';

import { REPV1UUID } from '@config';
import { repTokenMigrationConfig } from '@features/RepTokenMigration/config';
import { fAccounts, fAssets, fNetwork, fSettings, fTokenMigrationTxs } from '@fixtures';
import { RatesContext } from '@services';
import { DataContext, IDataContext, StoreContext } from '@services/Store';
import { ITxMultiConfirmProps, StoreAccount } from '@types';

import ConfirmTokenMigration from '../components/TokenMigrationConfirm';

const defaultProps: ITxMultiConfirmProps & {
  amount: string;
  account: StoreAccount;
} = {
  flowConfig: repTokenMigrationConfig,
  currentTxIdx: 0,
  amount: '1',
  account: fAccounts[0],
  transactions: fTokenMigrationTxs(),
  onComplete: jest.fn()
};

function getComponent(props: ITxMultiConfirmProps) {
  return simpleRender(
    <MemoryRouter initialEntries={undefined}>
      <DataContext.Provider
        value={
          ({
            addressBook: [],
            contracts: [],
            assets: [{ uuid: fNetwork.baseAsset }],
            settings: fSettings,
            networks: [fNetwork],
            userActions: []
          } as unknown) as IDataContext
        }
      >
        <RatesContext.Provider value={({ rates: {}, trackAsset: jest.fn() } as unknown) as any}>
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
        </RatesContext.Provider>
      </DataContext.Provider>
    </MemoryRouter>
  );
}

/* Test components */
describe('TokenMigrationConfirm', () => {
  test('Can render the TokenMigration confirm panel', () => {
    const { getAllByText } = getComponent(defaultProps);
    const asset = fAssets.find(({ uuid }) => uuid === REPV1UUID)!;
    expect(getAllByText(asset.ticker, { exact: false })).toBeDefined();
  });
});
