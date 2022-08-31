import { ComponentProps } from 'react';

import { mockAppState, screen, simpleRender } from 'test-utils';

import { ETHUUID } from '@config';
import { fAccounts, fAssets } from '@fixtures';
import { getAccountsByAsset } from '@services/Store';
import { TUuid } from '@types';
import { truncate } from '@utils';

import { MigrationTable } from '../components/MigrationTable';

type Props = ComponentProps<typeof MigrationTable>;

function getComponent(props: Props) {
  return simpleRender(<MigrationTable {...props} />, {
    initialState: mockAppState({ accounts: fAccounts, assets: fAssets })
  });
}

const defaultProps = {
  assetUuid: ETHUUID as TUuid
};

describe('MigrationTable', () => {
  test('render the table', async () => {
    const accounts = getAccountsByAsset(fAccounts, fAssets[0]);

    getComponent(defaultProps);

    expect(screen.getByText(truncate(accounts[0].address))).toBeDefined();
  });
  test("don't show address without defined asset", async () => {
    getComponent(defaultProps);

    expect(screen.queryByText(truncate(fAccounts[2].address))).toBeNull();
  });
});
