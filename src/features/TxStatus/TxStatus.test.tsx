import React from 'react';
import { MemoryRouter } from 'react-router';
import { simpleRender, waitFor, fireEvent, screen } from 'test-utils';
import selectEvent from 'react-select-event';

import {
  NetworkContext,
  StoreContext,
  AddressBookContext,
  SettingsContext,
  RatesContext,
  DataContext
} from '@services';
import { translateRaw } from '@translations';
import { fAccount, fNetwork, fAssets } from '@fixtures';

import TxStatus from './TxStatus';

const TX_HASH = '0x6a705a2943f19079dd712fa0b2ae1f7b036454ca6df881afc9e17573ee6ede8a';
const INVALID_TX_HASH = '0xb324e6630491f89aff0e8e30228741cbccc7ddfdb94c91eedc02141b1acc4df7';

jest.mock('ethers/providers', () => {
  const { mockFactory } = require('./__mocks__/txstatus');
  return mockFactory('0x6a705a2943f19079dd712fa0b2ae1f7b036454ca6df881afc9e17573ee6ede8a');
});

/* Test components */
describe('TxStatus', () => {
  const component = (path?: string) => (
    <MemoryRouter initialEntries={path ? [path] : undefined}>
      <DataContext.Provider
        value={
          {
            assets: fAssets,
            createActions: jest.fn()
          } as any
        }
      >
        <StoreContext.Provider value={{ accounts: [fAccount] } as any}>
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
        </StoreContext.Provider>
      </DataContext.Provider>
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

  test('Can render error state', async () => {
    const { getByText, container } = renderComponent('/tx-status?network=Ropsten');
    const selector = translateRaw('TX_STATUS');
    expect(getByText(selector)).toBeInTheDocument();
    fireEvent.change(container.querySelector('input[name="txhash"]')!, {
      target: { value: INVALID_TX_HASH }
    });
    fireEvent.click(container.querySelector('button')!);
    await waitFor(() =>
      expect(
        getByText('No transaction found with that hash.', { exact: false })
      ).toBeInTheDocument()
    );
  });

  test('When information is given in form fetching is done correctly', async () => {
    const { getByText, container } = renderComponent();
    const selector = translateRaw('TX_STATUS');
    expect(getByText(selector)).toBeInTheDocument();
    await selectEvent.openMenu(screen.getByLabelText('Network'));
    fireEvent.click(screen.getByTestId(`network-selector-option-${fNetwork.id}`));
    fireEvent.change(container.querySelector('input[name="txhash"]')!, {
      target: { value: TX_HASH }
    });
    fireEvent.click(container.querySelector('button')!);
    await waitFor(() => expect(getByText(fAssets[1].ticker, { exact: false })).toBeInTheDocument());
  });

  test('When information given in query string handles fetching correctly', async () => {
    const { getByText } = renderComponent(`/tx-status?hash=${TX_HASH}&network=Ropsten`);
    const selector = translateRaw('TX_STATUS');
    expect(getByText(selector)).toBeInTheDocument();
    await waitFor(() => expect(getByText(fAssets[1].ticker, { exact: false })).toBeInTheDocument());
  });
});
