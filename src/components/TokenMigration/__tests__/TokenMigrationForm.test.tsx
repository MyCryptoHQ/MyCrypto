import React from 'react';

import { MemoryRouter } from 'react-router';
import { simpleRender } from 'test-utils';

import { repTokenMigrationConfig } from '@features/RepTokenMigration/config';
import { fAccount, fAssets, fNetwork, fSettings } from '@fixtures';
import { FeatureFlagProvider } from '@services';
import { DataContext, IDataContext, StoreContext } from '@services/Store';
import { translateRaw } from '@translations';

import TokenMigrationForm, { TokenMigrationProps } from '../components/TokenMigrationForm';

const defaultProps: TokenMigrationProps = {
  isSubmitting: false,
  tokenMigrationConfig: repTokenMigrationConfig,
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
            settings: fSettings,
            networks: [fNetwork]
          } as unknown) as IDataContext
        }
      >
        <FeatureFlagProvider>
          <StoreContext.Provider
            value={
              ({
                userAssets: [],
                accounts: [],
                getDefaultAccount: () => ({ assets: [] }),
                getAccount: jest.fn(),
                networks: [{ nodes: [] }]
              } as unknown) as any
            }
          >
            <TokenMigrationForm {...((props as unknown) as any)} />
          </StoreContext.Provider>
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
