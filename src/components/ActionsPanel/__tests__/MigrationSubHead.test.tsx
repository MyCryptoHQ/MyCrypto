import React from 'react';

import { screen, simpleRender } from 'test-utils';

import { ETHUUID } from '@config';
import { fAccounts, fAssets } from '@fixtures';
import { DataContext, getAccountsByAsset, IDataContext, StoreContext } from '@services/Store';
import { translateRaw } from '@translations';
import { TUuid } from '@types';

import { MigrationSubHead } from '../components/MigrationSubHead';

type Props = React.ComponentProps<typeof MigrationSubHead>;

function getComponent(props: Props) {
  return simpleRender(
    <DataContext.Provider
      value={
        ({
          accounts: fAccounts,
          assets: fAssets
        } as unknown) as IDataContext
      }
    >
      <StoreContext.Provider
        value={
          ({
            accounts: fAccounts,
            assets: fAssets
          } as any) as any
        }
      >
        <MigrationSubHead {...props} />
      </StoreContext.Provider>
    </DataContext.Provider>
  );
}

const defaultProps = {
  assetUuid: ETHUUID as TUuid
};

describe('MigrationSubHead', () => {
  test('Render the subHeading', async () => {
    const accounts = getAccountsByAsset(fAccounts, fAssets[0]);

    getComponent(defaultProps);

    expect(
      screen.getByText(
        new RegExp(
          translateRaw('MIGRATION_SUBHEAD_PLURAL', {
            $total: accounts.length.toString()
          }),
          'i'
        )
      )
    ).toBeDefined();
  });
});
