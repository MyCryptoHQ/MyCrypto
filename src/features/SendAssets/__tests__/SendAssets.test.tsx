import React from 'react';

import { simpleRender } from 'test-utils';

import SendAssets from '@features/SendAssets/SendAssets';
import { StoreContext } from '@services/Store';
import { WalletId } from '@types';

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
            accounts: [],
            getDefaultAccount: () => ({ assets: [], wallet: WalletId.WEB3 }),
            getAccount: jest.fn(),
            networks: [{ nodes: [] }]
          } as unknown) as any
        }
      >
        <SendAssets />
      </StoreContext.Provider>
    );
  };

  test('Can render the first step (Send Assets Form) in the flow.', () => {
    const { getByText } = renderComponent();
    const selector = 'Send Assets';
    expect(getByText(selector)).toBeInTheDocument();
  });
});
