import React from 'react';

import { simpleRender } from 'test-utils';

import { fAccounts } from '@fixtures';
import { StoreContext } from '@services';
import { translateRaw } from '@translations';

import RequestAssets from './RequestAssets';

function getComponent() {
  return simpleRender(
    <StoreContext.Provider
      value={
        ({
          accounts: fAccounts,
          getDefaultAccount: () => fAccounts[0]
        } as any) as any
      }
    >
      <RequestAssets />
    </StoreContext.Provider>
  );
}

describe('RequestAssets', () => {
  test('it renders', async () => {
    const { getByText } = getComponent();
    expect(getByText(translateRaw('REQUEST'))).toBeInTheDocument();
    expect(getByText(fAccounts[0].label)).toBeInTheDocument();
  });
});
