import React from 'react';
import { MemoryRouter } from 'react-router';
import { simpleRender, waitFor } from 'test-utils';

import {
  NetworkContext,
  StoreContext,
  AssetContext,
  AddressBookContext,
  SettingsContext,
  RatesContext
} from '@services';
import { translateRaw } from '@translations';
import { fAccount, fNetwork, fAssets } from '@fixtures';

import TxStatus from './TxStatus';

const TX_HASH = '0x6a705a2943f19079dd712fa0b2ae1f7b036454ca6df881afc9e17573ee6ede8a ';

jest.mock('ethers/providers', () => {
  const { mockFactory } = require('./__mocks__/txstatus');
  return mockFactory();
});

/* Test components */
describe('TxStatus', () => {
  const component = (path?: string) => (
    <MemoryRouter initialEntries={path ? [path] : undefined}>
      <StoreContext.Provider value={{ accounts: [fAccount] } as any}>
        <AssetContext.Provider value={{ assets: fAssets } as any}>
          <NetworkContext.Provider
            value={
              {
                getNetworkById: jest.fn(),
                networks: [fNetwork]
              } as any
            }
          >
            <AddressBookContext.Provider
              value={{ getContactByAddressAndNetworkId: jest.fn() } as any}
            >
              <SettingsContext.Provider value={{ settings: { fiatCurrency: 'USD' } } as any}>
                <RatesContext.Provider value={{ getAssetRate: jest.fn() } as any}>
                  <TxStatus />
                </RatesContext.Provider>
              </SettingsContext.Provider>
            </AddressBookContext.Provider>
          </NetworkContext.Provider>
        </AssetContext.Provider>
      </StoreContext.Provider>
    </MemoryRouter>
  );

  const renderComponent = (pathToLoad?: string) => {
    return simpleRender(component(pathToLoad));
  };

  test('Can render', () => {
    const { getByText } = renderComponent();
    const selector = translateRaw('TX_STATUS');
    expect(getByText(selector)).toBeInTheDocument();
  });

  test('When information given in query string handles fetching correctly', async () => {
    const { getByText } = renderComponent(`/tx-status?hash=${TX_HASH}&network=Ropsten`);
    const selector = translateRaw('TX_STATUS');
    expect(getByText(selector)).toBeInTheDocument();
    await waitFor(() => expect(getByText(fAssets[1].ticker, { exact: false })).toBeInTheDocument());
  });
});
