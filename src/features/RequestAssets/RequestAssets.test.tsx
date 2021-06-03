import React from 'react';

import { mockAppState, simpleRender } from 'test-utils';

import { APP_STATE, fAccounts, fAssets } from '@fixtures';
import { StoreContext } from '@services';
import { translateRaw } from '@translations';

import RequestAssets from './RequestAssets';

function getComponent() {
  return simpleRender(
    <StoreContext.Provider
      value={
        ({
          accounts: fAccounts
        } as any) as any
      }
    >
      <RequestAssets />
    </StoreContext.Provider>,
    {
      initialState: mockAppState({
        accounts: [fAccounts[0]],
        assets: fAssets,
        networks: APP_STATE.networks
      })
    }
  );
}

describe('RequestAssets', () => {
  test('it renders', async () => {
    const { getByText } = getComponent();
    expect(getByText(translateRaw('REQUEST'))).toBeInTheDocument();
    expect(getByText(fAccounts[0].label)).toBeInTheDocument();
  });
});
