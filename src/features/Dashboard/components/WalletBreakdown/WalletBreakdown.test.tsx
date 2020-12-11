import React from 'react';

import { MemoryRouter } from 'react-router-dom';
import { ProvidersWrapper, simpleRender, waitFor } from 'test-utils';

import { fAccounts, fAssets, fContacts, fNetworks, fRates, fSettings } from '@fixtures';
import { DataContext, RatesContext, StoreProvider } from '@services';
import { translateRaw } from '@translations';

import { WalletBreakdown } from './WalletBreakdown';

function getComponent({ settings = fSettings, accounts = fAccounts }) {
  return simpleRender(
    <ProvidersWrapper>
      <MemoryRouter>
        <DataContext.Provider
          value={
            {
              addressBook: fContacts,
              accounts,
              assets: fAssets,
              contracts: [],
              networks: fNetworks,
              createActions: jest.fn(),
              userActions: [],
              settings
            } as any
          }
        >
          <RatesContext.Provider
            value={({ rates: fRates, trackAsset: jest.fn() } as unknown) as any}
          >
            <StoreProvider>
              <WalletBreakdown />
            </StoreProvider>
          </RatesContext.Provider>
        </DataContext.Provider>
      </MemoryRouter>
    </ProvidersWrapper>
  );
}

describe('WalletBreakdown', () => {
  it('can render', async () => {
    const { getByText, getAllByText, container } = getComponent({});

    expect(getByText(translateRaw('WALLET_BREAKDOWN_TITLE'))).toBeInTheDocument();

    // Renders Pie Chart
    await waitFor(() =>
      expect(container.querySelector('svg.recharts-surface')).toBeInTheDocument()
    );

    // Renders asset names
    fAccounts[0].assets.forEach((a) =>
      getAllByText(a.name).forEach((t) => expect(t).toBeInTheDocument())
    );

    // Renders total fiat value
    getAllByText('$767.14').forEach((s) => expect(s).toBeInTheDocument());
  });

  it('can render no assets state', async () => {
    const { getByText } = getComponent({ accounts: [{ ...fAccounts[0], assets: [] }] });

    expect(getByText(translateRaw('WALLET_BREAKDOWN_NO_ASSETS'))).toBeInTheDocument();
  });

  it('can render empty state', async () => {
    const { getByText } = getComponent({ settings: { ...fSettings, dashboardAccounts: [] } });

    expect(getByText(translateRaw('NO_ACCOUNTS_SELECTED_HEADER'))).toBeInTheDocument();
  });

  it('can render loading state', async () => {
    const { getByTestId } = getComponent({});

    // @todo Set isScanning selector?
    expect(getByTestId('skeleton-loader')).toBeInTheDocument();
  });
});
