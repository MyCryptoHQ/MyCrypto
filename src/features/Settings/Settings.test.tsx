import React from 'react';

import { Context as ResponsiveContext } from 'react-responsive';
import { MemoryRouter } from 'react-router-dom';
import { simpleRender } from 'test-utils';

import { fAccounts, fAssets, fContacts, fNetworks, fSettings } from '@fixtures';
import { DataContext, FeatureFlagProvider, RatesContext, StoreProvider } from '@services';
import { translateRaw } from '@translations';

import Settings from './Settings';

function getComponent() {
  return simpleRender(
    <ResponsiveContext.Provider value={{ width: 900 }}>
      <MemoryRouter>
        <DataContext.Provider
          value={
            {
              addressBook: fContacts,
              accounts: fAccounts,
              assets: fAssets,
              contracts: [],
              networks: fNetworks,
              createActions: jest.fn(),
              userActions: [],
              settings: fSettings
            } as any
          }
        >
          <StoreProvider>
            <RatesContext.Provider value={({ rates: {}, trackAsset: jest.fn() } as unknown) as any}>
              <FeatureFlagProvider>
                <Settings />
              </FeatureFlagProvider>
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

    expect(getAllByText('Accounts').length > 0).toBeTruthy();
  });

  it('has accounts', async () => {
    const { getAllByText } = getComponent();

    expect(getAllByText(fAccounts[0].label).length > 0).toBeTruthy();
  });

  it('has networks', async () => {
    const { getAllByText } = getComponent();

    expect(getAllByText(fNetworks[0].name).length > 0).toBeTruthy();
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
