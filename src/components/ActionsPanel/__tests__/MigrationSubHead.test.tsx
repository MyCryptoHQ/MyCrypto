import { ComponentProps } from 'react';

import { mockAppState, screen, simpleRender } from 'test-utils';

import { ETHUUID } from '@config';
import { fAccounts, fAssets } from '@fixtures';
import { getAccountsByAsset } from '@services/Store';
import { translateRaw } from '@translations';
import { TUuid } from '@types';

import { MigrationSubHead } from '../components/MigrationSubHead';

type Props = ComponentProps<typeof MigrationSubHead>;

function getComponent(props: Props) {
  return simpleRender(<MigrationSubHead {...props} />, {
    initialState: mockAppState({ accounts: fAccounts, assets: fAssets })
  });
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
