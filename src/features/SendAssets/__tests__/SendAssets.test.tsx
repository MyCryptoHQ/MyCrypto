import React from 'react';

import { mockAppState, simpleRender } from 'test-utils';

import SendAssets from '@features/SendAssets/SendAssets';
import { fAccounts, fAssets, fNetworks } from '@fixtures';

// SendFlow makes RPC calls to get nonce and gas.
jest.mock('@vendor', () => {
  return {
    ...jest.requireActual('@vendor'),
    // Since there are no nodes in our StoreContext,
    // ethers will default to FallbackProvider
    FallbackProvider: jest.fn().mockImplementation(() => ({
      getTransactionCount: () => 10
    }))
  };
});
/* Test components */
describe('SendAssetsFlow', () => {
  const renderComponent = () => {
    return simpleRender(<SendAssets />, {
      initialState: mockAppState({ accounts: fAccounts, assets: fAssets, networks: fNetworks })
    });
  };

  test('Can render the first step (Send Assets Form) in the flow.', () => {
    const { getByText } = renderComponent();
    const selector = 'Send Assets';
    expect(getByText(selector)).toBeInTheDocument();
  });
});
