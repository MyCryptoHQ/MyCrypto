import React from 'react';

import { MemoryRouter } from 'react-router';
import { simpleRender } from 'test-utils';

import SendAssets from '@features/SendAssets/SendAssets';
import { fAssets, fSettings } from '@fixtures';
import { FeatureFlagProvider, RatesContext } from '@services';
import { DataContext, StoreContext } from '@services/Store';
import { WalletId } from '@types';

// SendFlow makes RPC calls to get nonce and gas.
jest.mock('ethers/providers', () => {
  return {
    // Since there are no nodes in our StoreContext,
    // ethers will default to FallbackProvider
    FallbackProvider: () => ({
      getTransactionCount: () => 10
    })
  };
});
/* Test components */
describe('SendAssetsFlow', () => {
  const component = (path?: string) => (
    <MemoryRouter initialEntries={path ? [path] : undefined}>
      <DataContext.Provider
        value={
          {
            addressBook: [],
            settings: fSettings,
            assets: fAssets,
            createActions: jest.fn()
          } as any
        }
      >
        <FeatureFlagProvider>
          <StoreContext.Provider
            value={
              ({
                userAssets: [],
                accounts: [],
                defaultAccount: { assets: [], wallet: WalletId.WEB3 },
                getAccount: jest.fn(),
                networks: [{ nodes: [] }]
              } as unknown) as any
            }
          >
            <RatesContext.Provider value={{ rates: {}, trackAsset: jest.fn() } as any}>
              <SendAssets />
            </RatesContext.Provider>
          </StoreContext.Provider>
        </FeatureFlagProvider>
      </DataContext.Provider>
    </MemoryRouter>
  );

  const renderComponent = (pathToLoad?: string) => {
    return simpleRender(component(pathToLoad));
  };

  test('Can render the first step (Send Assets Form) in the flow.', () => {
    const { getByText } = renderComponent();
    const selector = 'Send Assets';
    expect(getByText(selector)).toBeInTheDocument();
  });
});
