import React from 'react';

import mockAxios from 'jest-mock-axios';
import { fireEvent, ProvidersWrapper, simpleRender, waitFor } from 'test-utils';

import { fAccounts, fAssets, fNetworks, fSettings, fSwapQuote } from '@fixtures';
import { DataContext, IDataContext, StoreContext } from '@services/Store';

import SwapAssetsFlow from './SwapAssetsFlow';

function getComponent() {
  return simpleRender(
    <ProvidersWrapper>
      <DataContext.Provider
        value={
          ({
            assets: fAssets,
            accounts: fAccounts,
            addressBook: [],
            contracts: [],
            userActions: [],
            settings: fSettings,
            networks: fNetworks,
            rates: {},
            trackedAssets: []
          } as unknown) as IDataContext
        }
      >
        <StoreContext.Provider
          value={
            ({
              assets: () => fAssets,
              accounts: fAccounts,
              userAssets: fAccounts.flatMap((a) => a.assets),
              getDefaultAccount: () => undefined
            } as any) as any
          }
        >
          <SwapAssetsFlow />
        </StoreContext.Provider>
      </DataContext.Provider>
    </ProvidersWrapper>
  );
}

describe('SwapAssetsFlow', () => {
  afterEach(() => {
    mockAxios.reset();
  });
  it('selects default tokens', async () => {
    const { getAllByText } = getComponent();
    expect(mockAxios.get).toHaveBeenCalledWith('swap/v1/tokens');
    mockAxios.mockResponse({ data: { records: fAssets.map((a) => ({ ...a, symbol: a.ticker })) } });
    await waitFor(() => expect(getAllByText(fAssets[0].ticker, { exact: false })).toBeDefined());
    await waitFor(() => expect(getAllByText(fAssets[13].ticker, { exact: false })).toBeDefined());
  });

  it('calculates and shows to amount', async () => {
    const { getAllByText, getAllByDisplayValue, container } = getComponent();
    expect(mockAxios.get).toHaveBeenCalledWith('swap/v1/tokens');
    mockAxios.mockResponse({ data: { records: fAssets.map((a) => ({ ...a, symbol: a.ticker })) } });
    await waitFor(() => expect(getAllByText(fAssets[0].ticker, { exact: false })).toBeDefined());
    await waitFor(() => expect(getAllByText(fAssets[13].ticker, { exact: false })).toBeDefined());
    mockAxios.reset();
    fireEvent.change(container.querySelector('input[name="swap-from"]')!, {
      target: { value: '1' }
    });
    await waitFor(() =>
      expect(mockAxios.get).toHaveBeenCalledWith('swap/v1/quote', expect.anything())
    );
    mockAxios.mockResponse({ data: fSwapQuote });
    await waitFor(() => expect(getAllByDisplayValue('1', { exact: false })).toBeDefined());
    await waitFor(() =>
      expect(getAllByDisplayValue('0.000642566300455615', { exact: false })).toBeDefined()
    );
  });
});
