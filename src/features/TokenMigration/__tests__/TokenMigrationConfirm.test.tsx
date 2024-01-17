import { ComponentProps } from 'react';

import { mockAppState, simpleRender } from 'test-utils';

import { REPV1UUID } from '@config';
import { fAccounts, fAssets, fNetworks, fSettings, fTokenMigrationTxs } from '@fixtures';
import { ITxMultiConfirmProps, StoreAccount } from '@types';

import ConfirmTokenMigration from '../components/TokenMigrationConfirm';
import { MIGRATION_CONFIGS } from '../config';

const defaultProps: ITxMultiConfirmProps & {
  amount: string;
  account: StoreAccount;
} = {
  flowConfig: MIGRATION_CONFIGS.REP,
  currentTxIdx: 0,
  amount: '1',
  account: fAccounts[0],
  transactions: fTokenMigrationTxs(),
  onComplete: jest.fn()
};

function getComponent(props: ComponentProps<typeof ConfirmTokenMigration>) {
  return simpleRender(<ConfirmTokenMigration {...props} />, {
    initialState: mockAppState({ settings: fSettings, networks: fNetworks })
  });
}

/* Test components */
describe('TokenMigrationConfirm', () => {
  test('Can render the TokenMigration confirm panel', () => {
    const { getAllByText } = getComponent(defaultProps);
    const asset = fAssets.find(({ uuid }) => uuid === REPV1UUID)!;
    expect(getAllByText(asset.ticker, { exact: false })).toBeDefined();
  });
});
