import React from 'react';

import { mockAppState, simpleRender } from 'test-utils';

import { fAccounts, fNetworks } from '@fixtures';
import { translateRaw } from '@translations';

import RequestAssets from './RequestAssets';

function getComponent() {
  return simpleRender(<RequestAssets />, {
    initialState: mockAppState({ accounts: fAccounts, networks: fNetworks })
  });
}

describe('RequestAssets', () => {
  test('it renders', async () => {
    const { getByText } = getComponent();
    expect(getByText(translateRaw('REQUEST'))).toBeInTheDocument();
    expect(getByText(fAccounts[1].label)).toBeInTheDocument();
  });
});
