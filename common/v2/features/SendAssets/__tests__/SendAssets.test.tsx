import React from 'react';
import { MemoryRouter } from 'react-router';
import { simpleRender } from 'test-utils';

// New
import SendAssets from 'v2/features/SendAssets/SendAssets';
import { StoreContext } from 'v2/services/Store';
import { RatesContext } from 'v2/services/RatesProvider';

/* Test components */
describe('SendAssetsFlow', () => {
  const component = (path?: string) => (
    <MemoryRouter initialEntries={path ? [path] : undefined}>
      <StoreContext.Provider
        value={
          ({
            userAssets: [],
            accounts: [],
            getAccount: jest.fn(),
            networks: []
          } as unknown) as any
        }
      >
        <RatesContext.Provider
          value={
            ({
              getAssetRate: jest.fn()
            } as unknown) as any
          }
        >
          <SendAssets />;
        </RatesContext.Provider>
      </StoreContext.Provider>
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
