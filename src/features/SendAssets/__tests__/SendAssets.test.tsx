import React from 'react';
import { MemoryRouter } from 'react-router';
import { simpleRender } from 'test-utils';

import SendAssets from '@features/SendAssets/SendAssets';
import { FeatureFlagProvider, RatesContext } from '@services';
import { StoreContext, SettingsContext, DataContext } from '@services/Store';
import { fSettings, fAssets } from '@fixtures';

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
            assets: fAssets,
            createActions: jest.fn()
          } as any
        }
      >
        <FeatureFlagProvider>
          <SettingsContext.Provider
            value={
              ({
                settings: fSettings
              } as unknown) as any
            }
          >
            <StoreContext.Provider
              value={
                ({
                  userAssets: [],
                  accounts: [],
                  defaultAccount: { assets: [] },
                  getAccount: jest.fn(),
                  networks: [{ nodes: [] }]
                } as unknown) as any
              }
            >
              <RatesContext.Provider value={{ rates: {}, trackAsset: jest.fn() } as any}>
                <SendAssets />
              </RatesContext.Provider>
            </StoreContext.Provider>
          </SettingsContext.Provider>
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
