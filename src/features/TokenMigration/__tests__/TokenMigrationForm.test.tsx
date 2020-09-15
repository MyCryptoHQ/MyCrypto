import React from 'react';

import { MemoryRouter } from 'react-router';
import { simpleRender } from 'test-utils';

import {
  default as TokenMigrationForm,
  TokenMigrationProps
} from '@features/TokenMigration/components/TokenMigrationForm';
import { fAccount, fAssets, fNetwork, fSettings } from '@fixtures';
import { FeatureFlagProvider } from '@services';
import { DataContext, SettingsContext, StoreContext } from '@services/Store';
import { translateRaw } from '@translations';

const defaultProps: TokenMigrationProps = {
  isSubmitting: false,
  asset: fAssets[0],
  network: fNetwork,
  address: '',
  amount: '',
  gasLimit: '',
  gasPrice: '',
  nonce: '',
  account: fAccount,
  onComplete: jest.fn(),
  handleUserInputFormSubmit: jest.fn()
};

function getComponent(props: TokenMigrationProps) {
  return simpleRender(
    <MemoryRouter initialEntries={undefined}>
      <DataContext.Provider
        value={
          ({
            assets: [{ uuid: fNetwork.baseAsset }],
            networks: [fNetwork],
            createActions: jest.fn()
          } as unknown) as any
        }
      >
        <FeatureFlagProvider>
          <SettingsContext.Provider
            value={
              ({
                settings: fSettings
              } as unknown) as any
            }
          >
            <StoreContext.Provider
              value={
                ({
                  userAssets: [],
                  accounts: [],
                  defaultAccount: { assets: [] },
                  getAccount: jest.fn(),
                  networks: [{ nodes: [] }]
                } as unknown) as any
              }
            >
              <TokenMigrationForm {...((props as unknown) as any)} />
            </StoreContext.Provider>
          </SettingsContext.Provider>
        </FeatureFlagProvider>
      </DataContext.Provider>
    </MemoryRouter>
  );
}

/* Test components */
describe('TokenMigrationForm', () => {
  test('Can render the first step (Token Migration Form) in the flow.', () => {
    const { getByText } = getComponent(defaultProps);
    const selector = translateRaw('REP_TOKEN_MIGRATION');
    expect(getByText(selector)).toBeInTheDocument();
  });
});
