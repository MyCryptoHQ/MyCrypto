import React from 'react';

import { screen, simpleRender } from 'test-utils';

import { ETHUUID } from '@config';
import { fAccounts, fAssets } from '@fixtures';
import { getAccountsByAsset, StoreContext } from '@services/Store';
import { TUuid } from '@types';
import { truncate } from '@utils';

import { MigrationTable } from '../components/MigrationTable';

type Props = React.ComponentProps<typeof MigrationTable>;

function getComponent(props: Props) {
  return simpleRender(
    <StoreContext.Provider
      value={
        ({
          accounts: fAccounts,
          assets: fAssets
        } as any) as any
      }
    >
      <MigrationTable {...props} />
    </StoreContext.Provider>
  );
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
