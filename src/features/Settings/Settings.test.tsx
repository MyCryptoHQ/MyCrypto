import React from 'react';

import { Context as ResponsiveContext } from 'react-responsive';
import { MemoryRouter } from 'react-router-dom';
import { simpleRender } from 'test-utils';

import { fAccounts, fAssets, fContacts, fNetworks, fSettings } from '@fixtures';
import { DataContext, IDataContext, RatesContext, StoreProvider } from '@services';
import { translateRaw } from '@translations';

import Settings from './Settings';

function getComponent() {
  return simpleRender(
    <ResponsiveContext.Provider value={{ width: 900 }}>
      <MemoryRouter>
        <DataContext.Provider
          value={
            ({
              addressBook: fContacts,
              accounts: fAccounts,
              assets: fAssets,
              contracts: [],
              networks: fNetworks,
              userActions: [],
              settings: fSettings
            } as unknown) as IDataContext
          }
        >
          <StoreProvider>
            <RatesContext.Provider value={({ rates: {}, trackAsset: jest.fn() } as unknown) as any}>
              <Settings />
            </RatesContext.Provider>
          </StoreProvider>
        </DataContext.Provider>
      </MemoryRouter>
    </ResponsiveContext.Provider>
  );
}

describe('Settings', () => {
  it('renders', async () => {
    const { getAllByText } = getComponent();

    getAllByText('Accounts').forEach((n) => expect(n).toBeInTheDocument());
  });

  it('has accounts', async () => {
    const { getAllByText } = getComponent();

    getAllByText(fAccounts[0].label).forEach((n) => expect(n).toBeInTheDocument());
  });

  it('has networks', async () => {
    const { getAllByText } = getComponent();

    getAllByText(fNetworks[0].name).forEach((n) => expect(n).toBeInTheDocument());
  });

  it('has general settings', async () => {
    const { getByText } = getComponent();

    expect(getByText(translateRaw('SETTINGS_GENERAL_LABEL'))).toBeDefined();
    expect(getByText(translateRaw('SETTINGS_FIAT_SELECTION_LABEL'))).toBeDefined();
  });

  it('has danger zone', async () => {
    const { getByText } = getComponent();

    expect(getByText(translateRaw('SETTINGS_DANGER_ZONE'))).toBeDefined();
  });
});
