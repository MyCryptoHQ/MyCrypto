import React from 'react';

import { APP_STATE, mockAppState, simpleRender } from 'test-utils';

import { repTokenMigrationConfig } from '@features/RepTokenMigration/config';
import { fAccounts, fAssets, fSettings } from '@fixtures';
import { translateRaw } from '@translations';
import { truncate } from '@utils';

import TokenMigrationStepper from '../TokenMigrationStepper';

jest.mock('@services/EthService', () => ({
  getNonce: jest.fn().mockReturnValue(1)
}));

/* Test components */
describe('TokenMigrationStepper', () => {
  const renderComponent = () =>
    simpleRender(<TokenMigrationStepper tokenMigrationConfig={repTokenMigrationConfig} />, {
      initialState: mockAppState({
        assets: fAssets,
        settings: fSettings,
        networks: APP_STATE.networks,
        accounts: fAccounts
      })
    });

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
