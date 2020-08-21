import React from 'react';
import { MemoryRouter } from 'react-router';
import { simpleRender } from 'test-utils';

import { translateRaw } from '@translations';
import {
  TokenMigrationProps,
  default as TokenMigrationForm
} from '@features/TokenMigration/components/TokenMigrationForm';
import { FeatureFlagContext } from '@services';
import { StoreContext, SettingsContext, NetworkContext, DataContext } from '@services/Store';
import { fSettings, fAssets, fNetwork, fAccount } from '@fixtures';
import { IS_ACTIVE_FEATURE } from '@config';
import { noOp } from '@utils';

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
            createActions: jest.fn()
          } as unknown) as any
        }
      >
        <FeatureFlagContext.Provider
          value={{ IS_ACTIVE_FEATURE, setFeatureFlag: noOp, resetFeatureFlags: noOp }}
        >
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
              <NetworkContext.Provider
                value={
                  ({
                    networks: [fNetwork]
                  } as unknown) as any
                }
              >
                <TokenMigrationForm {...((props as unknown) as any)} />
              </NetworkContext.Provider>
            </StoreContext.Provider>
          </SettingsContext.Provider>
        </FeatureFlagContext.Provider>
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
