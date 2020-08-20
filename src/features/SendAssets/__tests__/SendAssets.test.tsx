import React from 'react';
import { MemoryRouter } from 'react-router';
import { simpleRender } from 'test-utils';

import SendAssets from '@features/SendAssets/SendAssets';
import { FeatureFlagContext } from '@services';
import { StoreContext, AddressBookContext, SettingsContext } from '@services/Store';
import { RatesContext } from '@services/RatesProvider';
import { fSettings } from '@fixtures';
import { IS_ACTIVE_FEATURE } from '@config';
import { noOp } from '@utils';

/* Test components */
describe('SendAssetsFlow', () => {
  const component = (path?: string) => (
    <MemoryRouter initialEntries={path ? [path] : undefined}>
      <FeatureFlagContext.Provider
        value={{ IS_ACTIVE_FEATURE, setFeatureFlag: noOp, resetFeatureFlags: noOp }}
      >
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
                getAccount: jest.fn(),
                networks: []
              } as unknown) as any
            }
          >
            <RatesContext.Provider
              value={
                ({
                  getAssetRate: jest.fn(),
                  getRate: jest.fn()
                } as unknown) as any
              }
            >
              <AddressBookContext.Provider
                value={({ addressBook: [], getContactByAddress: jest.fn() } as unknown) as any}
              >
                <SendAssets />
              </AddressBookContext.Provider>
            </RatesContext.Provider>
          </StoreContext.Provider>
        </SettingsContext.Provider>
      </FeatureFlagContext.Provider>
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
