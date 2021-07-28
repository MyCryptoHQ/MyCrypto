import { fireEvent, waitFor } from '@testing-library/react';
import { APP_STATE, mockAppState, simpleRender } from 'test-utils';

import { fAccounts, fAssets } from '@fixtures';
import { ProviderHandler } from '@services';
import { translateRaw } from '@translations';

import { AddToken } from './AddToken';

const mockGetTokenInformation = jest.fn().mockImplementation(async () => ({
  symbol: 'DAI',
  decimals: 18
}));
ProviderHandler.prototype.getTokenInformation = mockGetTokenInformation;

const getComponent = () => {
  return simpleRender(
    <AddToken setShowAddToken={jest.fn()} scanTokens={jest.fn()} setShowDetailsView={jest.fn()} />,
    {
      initialState: mockAppState({
        accounts: fAccounts,
        assets: fAssets,
        networks: APP_STATE.networks,
        settings: { ...APP_STATE.settings, dashboardAccounts: fAccounts.map((a) => a.uuid) }
      })
    }
  );
};

describe('AddToken', () => {
  it('fetches token information when entering an address', async () => {
    const { getByLabelText } = getComponent();

    const input = getByLabelText(translateRaw('ADDRESS'));
    fireEvent.change(input, { target: { value: '0x6b175474e89094c44da98b954eedeac495271d0f' } });

    const symbol = getByLabelText(translateRaw('SYMBOL')) as HTMLInputElement;
    const decimals = getByLabelText(translateRaw('TOKEN_DEC')) as HTMLInputElement;
    await waitFor(() => expect(symbol.value).toBe('DAI'));
    expect(decimals.value).toBe('18');
  });

  it('uses existing values if information cannot be fetched', async () => {
    mockGetTokenInformation.mockImplementationOnce(async () => ({ decimals: 18 }));

    const { getByLabelText } = getComponent();

    const input = getByLabelText(translateRaw('ADDRESS'));
    const symbol = getByLabelText(translateRaw('SYMBOL')) as HTMLInputElement;
    const decimals = getByLabelText(translateRaw('TOKEN_DEC')) as HTMLInputElement;

    fireEvent.change(symbol, { target: { value: 'FOO' } });
    fireEvent.change(input, { target: { value: '0x6b175474e89094c44da98b954eedeac495271d0f' } });

    await waitFor(() => expect(decimals.value).toBe('18'));
    expect(symbol.value).toBe('FOO');
  });
});
