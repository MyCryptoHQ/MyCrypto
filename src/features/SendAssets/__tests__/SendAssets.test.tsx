import React from 'react';

import { APP_STATE, mockAppState, simpleRender } from 'test-utils';

import SendAssets from '@features/SendAssets/SendAssets';
import { fAccounts, fAssets } from '@fixtures';
import { StoreContext } from '@services/Store';

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
    return simpleRender(
      <StoreContext.Provider
        value={
          ({
            userAssets: [],
            accounts: fAccounts,
            getAccount: jest.fn()
          } as unknown) as any
        }
      >
        <SendAssets />
      </StoreContext.Provider>,
      {
        initialState: mockAppState({
          accounts: fAccounts,
          assets: fAssets,
          networks: APP_STATE.networks
        })
      }
    );
  };

  test('Can render the first step (Send Assets Form) in the flow.', () => {
    const { getByText } = renderComponent();
    const selector = 'Send Assets';
    expect(getByText(selector)).toBeInTheDocument();
    expect(getByText(fAccounts[0].label)).toBeInTheDocument();
  });
});
