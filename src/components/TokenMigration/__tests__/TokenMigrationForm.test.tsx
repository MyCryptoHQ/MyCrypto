import React from 'react';

import { simpleRender } from 'test-utils';

import { repTokenMigrationConfig } from '@features/RepTokenMigration/config';
import { fAccount, fAssets, fNetwork } from '@fixtures';
import { StoreContext } from '@services/Store';
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
