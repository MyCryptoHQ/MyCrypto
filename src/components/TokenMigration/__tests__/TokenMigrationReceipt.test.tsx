import React from 'react';

import { simpleRender } from 'test-utils';

import { REPV1UUID } from '@config';
import { repTokenMigrationConfig } from '@features/RepTokenMigration/config';
import { fAccounts, fAssets, fTokenMigrationTxs } from '@fixtures';
import { StoreContext } from '@services/Store';
import { translateRaw } from '@translations';

import TokenMigrationReceipt, {
  TokenMigrationReceiptProps
} from '../components/TokenMigrationReceipt';

const defaultProps: TokenMigrationReceiptProps = {
  flowConfig: repTokenMigrationConfig,
  account: fAccounts[0],
  amount: '4',
  transactions: fTokenMigrationTxs(),
  onComplete: jest.fn()
};

function getComponent(props: TokenMigrationReceiptProps) {
  return simpleRender(
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
      <TokenMigrationReceipt {...props} />
    </StoreContext.Provider>
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
