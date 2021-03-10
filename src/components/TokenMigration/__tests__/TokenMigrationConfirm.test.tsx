import React from 'react';

import { mockAppState, simpleRender } from 'test-utils';

import { REPV1UUID } from '@config';
import { repTokenMigrationConfig } from '@features/RepTokenMigration/config';
import { fAccounts, fAssets, fNetworks, fSettings, fTokenMigrationTxs } from '@fixtures';
import { StoreContext } from '@services/Store';
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

function getComponent(props: React.ComponentProps<typeof ConfirmTokenMigration>) {
  return simpleRender(
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
      <ConfirmTokenMigration {...props} />
    </StoreContext.Provider>,
    {
      initialState: mockAppState({ settings: fSettings, networks: fNetworks })
    }
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
