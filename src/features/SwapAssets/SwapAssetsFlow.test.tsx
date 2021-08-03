import mockAxios from 'jest-mock-axios';
import selectEvent from 'react-select-event';
import { APP_STATE, fireEvent, mockAppState, simpleRender, waitFor } from 'test-utils';

import { DEX_BASE_URLS } from '@config';
import { fAccounts, fAssets, fDAI, fSwapQuote, fSwapQuoteReverse } from '@fixtures';
import { NetworkId } from '@types';
import { truncate } from '@utils';

import SwapAssetsFlow from './SwapAssetsFlow';

jest.mock('@services/ApiService/Gas', () => ({
  ...jest.requireActual('@services/ApiService/Gas'),
  fetchGasPriceEstimates: () => Promise.resolve({ fast: 20 }),
  getGasEstimate: () => Promise.resolve(21000)
}));

function getComponent() {
  return simpleRender(<SwapAssetsFlow />, {
    initialState: mockAppState({
      accounts: fAccounts.filter((a) => a.networkId === 'Ethereum'),
      assets: [...fAssets, { ...fDAI, networkId: 'SmartChain' as NetworkId }].map((a) => ({
        ...a,
        isSwapRelevant: true
      })),
      networks: APP_STATE.networks
    })
  });
}

describe('SwapAssetsFlow', () => {
  afterEach(() => {
    mockAxios.reset();
  });
  it('selects default tokens', async () => {
    const { getAllByText } = getComponent();
    await waitFor(() => expect(getAllByText(fAssets[0].ticker, { exact: false })).toBeDefined());
    await waitFor(() => expect(getAllByText(fAssets[13].ticker, { exact: false })).toBeDefined());
  });

  it('selects default account', async () => {
    const { getByText } = getComponent();
    await waitFor(() =>
      expect(getByText(truncate(fAccounts[0].address), { exact: false })).toBeDefined()
    );
  });

  it('calculates and shows to amount', async () => {
    const { getAllByText, getAllByDisplayValue, container } = getComponent();
    await waitFor(() => expect(getAllByText(fAssets[0].ticker, { exact: false })).toBeDefined());
    await waitFor(() => expect(getAllByText(fAssets[13].ticker, { exact: false })).toBeDefined());
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
    await waitFor(() => expect(getAllByText(fAssets[0].ticker, { exact: false })).toBeDefined());
    await waitFor(() => expect(getAllByText(fAssets[13].ticker, { exact: false })).toBeDefined());
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
    await waitFor(() => expect(getAllByText(fAssets[15].ticker, { exact: false })).toBeDefined());
    await waitFor(() => expect(getAllByText(fDAI.ticker, { exact: false })).toBeDefined());
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
