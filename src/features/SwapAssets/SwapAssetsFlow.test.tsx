import React from 'react';

import mockAxios from 'jest-mock-axios';
import selectEvent from 'react-select-event';
import { fireEvent, mockAppState, simpleRender, waitFor } from 'test-utils';

import { DEX_BASE_URLS } from '@config';
import { fAccounts, fAssets, fSwapQuote, fSwapQuoteReverse, fValidNetworks } from '@fixtures';
import { truncate } from '@utils';

import SwapAssetsFlow from './SwapAssetsFlow';

function getComponent() {
  return simpleRender(<SwapAssetsFlow />, {
    initialState: mockAppState({
      accounts: fAccounts,
      assets: fAssets,
      networks: fValidNetworks
    })
  });
}

const tokenResponse = {
  data: {
    records: [fAssets[0], fAssets[13]].map((a) => ({
      ...a,
      symbol: a.ticker,
      address: a.type === 'base' ? '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' : a.contractAddress
    }))
  }
};

describe('SwapAssetsFlow', () => {
  beforeEach(() => mockAxios.reset());
  afterAll(() => mockAxios.reset());

  it('selects default tokens', async () => {
    const { getAllByText } = getComponent();
    expect(mockAxios.get).toHaveBeenCalledWith('swap/v1/tokens', {
      baseURL: DEX_BASE_URLS.Ethereum
    });
    mockAxios.mockResponse(tokenResponse);
    await waitFor(() => expect(getAllByText(fAssets[0].ticker, { exact: false })).toBeDefined());
    await waitFor(() => expect(getAllByText(fAssets[13].ticker, { exact: false })).toBeDefined());
  });

  it('selects default account', async () => {
    const { getByText } = getComponent();
    expect(mockAxios.get).toHaveBeenCalledWith('swap/v1/tokens', {
      baseURL: DEX_BASE_URLS.Ethereum
    });
    mockAxios.mockResponse(tokenResponse);
    await waitFor(() =>
      expect(getByText(truncate(fAccounts[0].address), { exact: false })).toBeDefined()
    );
  });

  it('calculates and shows to amount', async () => {
    const { getAllByText, getAllByDisplayValue, container } = getComponent();
    expect(mockAxios.get).toHaveBeenCalledWith('swap/v1/tokens', {
      baseURL: DEX_BASE_URLS.Ethereum
    });
    mockAxios.mockResponse(tokenResponse);
    await waitFor(() => expect(getAllByText(fAssets[0].ticker, { exact: false })).toBeDefined());
    await waitFor(() => expect(getAllByText(fAssets[13].ticker, { exact: false })).toBeDefined());
    mockAxios.reset();
    fireEvent.change(container.querySelector('input[name="swap-from"]')!, {
      target: { value: '1' }
    });
    await waitFor(() =>
      expect(mockAxios.get).toHaveBeenCalledWith(
        'swap/v1/quote',
        expect.objectContaining({ baseURL: DEX_BASE_URLS.Ethereum })
      )
    );
    mockAxios.mockResponse({ data: fSwapQuote });
    await waitFor(() => expect(getAllByDisplayValue('1', { exact: false })).toBeDefined());
    await waitFor(() =>
      expect(getAllByDisplayValue('0.000642566300455615', { exact: false })).toBeDefined()
    );
  });

  it('calculates and shows from amount', async () => {
    const { getAllByText, getAllByDisplayValue, container } = getComponent();
    expect(mockAxios.get).toHaveBeenCalledWith('swap/v1/tokens', {
      baseURL: DEX_BASE_URLS.Ethereum
    });
    mockAxios.mockResponse(tokenResponse);
    await waitFor(() => expect(getAllByText(fAssets[0].ticker, { exact: false })).toBeDefined());
    await waitFor(() => expect(getAllByText(fAssets[13].ticker, { exact: false })).toBeDefined());
    mockAxios.reset();
    fireEvent.change(container.querySelector('input[name="swap-to"]')!, {
      target: { value: '1' }
    });
    await waitFor(() =>
      expect(mockAxios.get).toHaveBeenCalledWith(
        'swap/v1/quote',
        expect.objectContaining({ baseURL: DEX_BASE_URLS.Ethereum })
      )
    );
    mockAxios.mockResponse({ data: fSwapQuoteReverse });
    await waitFor(() => expect(getAllByDisplayValue('1', { exact: false })).toBeDefined());
    await waitFor(() =>
      expect(getAllByDisplayValue('1.305248867560021093', { exact: false })).toBeDefined()
    );
  });

  it('uses different base url after switching networks', async () => {
    const {
      getAllByText,
      getAllByDisplayValue,
      getByLabelText,
      getByTestId,
      container
    } = getComponent();
    await selectEvent.openMenu(getByLabelText(/network/i));
    fireEvent.click(getByTestId('network-selector-option-SmartChain'));
    await waitFor(() =>
      expect(mockAxios.get).toHaveBeenCalledWith('swap/v1/tokens', {
        baseURL: DEX_BASE_URLS.SmartChain
      })
    );
    mockAxios.mockResponse(tokenResponse);
    await waitFor(() => expect(getAllByText(fAssets[0].ticker, { exact: false })).toBeDefined());
    await waitFor(() => expect(getAllByText(fAssets[13].ticker, { exact: false })).toBeDefined());
    mockAxios.reset();
    fireEvent.change(container.querySelector('input[name="swap-from"]')!, {
      target: { value: '1' }
    });
    await waitFor(() =>
      expect(mockAxios.get).toHaveBeenCalledWith(
        'swap/v1/quote',
        expect.objectContaining({ baseURL: DEX_BASE_URLS.SmartChain })
      )
    );
    mockAxios.mockResponse({ data: fSwapQuote });
    await waitFor(() => expect(getAllByDisplayValue('1', { exact: false })).toBeDefined());
    await waitFor(() =>
      expect(getAllByDisplayValue('0.000642566300455615', { exact: false })).toBeDefined()
    );
  });
});
