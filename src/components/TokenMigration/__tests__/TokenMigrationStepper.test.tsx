import React from 'react';

import { MemoryRouter } from 'react-router';
import { simpleRender } from 'test-utils';

import { REPV1UUID } from '@config';
import { repTokenMigrationConfig } from '@features/RepTokenMigration/config';
import { fAccounts, fAssets, fNetworks, fSettings } from '@fixtures';
import { FeatureFlagProvider } from '@services';
import { DataContext, IDataContext, StoreContext } from '@services/Store';
import { translateRaw } from '@translations';
import { truncate } from '@utils';

import TokenMigrationStepper from '../TokenMigrationStepper';

/* Test components */
describe('TokenMigrationStepper', () => {
  const StepperComponent = (
    <MemoryRouter initialEntries={undefined}>
      <DataContext.Provider
        value={
          ({
            assets: fAssets,
            settings: fSettings,
            networks: fNetworks
          } as unknown) as IDataContext
        }
      >
        <FeatureFlagProvider>
          <StoreContext.Provider
            value={
              ({
                userAssets: [],
                accounts: [fAccounts[0]],
                getDefaultAccount: () => fAccounts[0],
                getAccount: jest.fn(),
                networks: fNetworks,
                getAssetByUUID: () => fAssets.find(({ uuid }) => uuid === REPV1UUID)
              } as unknown) as any
            }
          >
            <TokenMigrationStepper tokenMigrationConfig={repTokenMigrationConfig} />
          </StoreContext.Provider>
        </FeatureFlagProvider>
      </DataContext.Provider>
    </MemoryRouter>
  );
  const renderComponent = () => simpleRender(StepperComponent);

  it('renders the first step in the flow', () => {
    const { getByText } = renderComponent();
    const selector = translateRaw('REP_TOKEN_MIGRATION');
    expect(getByText(selector, { selector: 'p' })).toBeInTheDocument();
  });

  it('auto-fills the form with an account if an account has a balance of the token being migrated', () => {
    const { getByText } = renderComponent();
    const selector = truncate(fAccounts[0].address); // detects the user's account as the first item in the array
    expect(getByText(selector)).toBeInTheDocument();
  });
});
