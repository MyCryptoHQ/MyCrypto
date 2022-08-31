import { APP_STATE, mockAppState, simpleRender } from 'test-utils';

import { fAccount, fAccounts, fAssets, fNetwork } from '@fixtures';
import { translateRaw } from '@translations';
import { MigrationType } from '@types';

import TokenMigrationForm, { TokenMigrationProps } from '../components/TokenMigrationForm';

jest.mock('@vendor', () => {
  return {
    ...jest.requireActual('@vendor'),
    FallbackProvider: jest.fn().mockImplementation(() => ({
      getTransactionCount: () => 10
    }))
  };
});

const defaultProps: TokenMigrationProps = {
  isSubmitting: false,
  migration: MigrationType.REP,
  asset: fAssets[0],
  network: fNetwork,
  address: '',
  amount: '',
  gasLimit: '',
  gasPrice: '',
  nonce: '',
  account: fAccount,
  changeMigration: jest.fn(),
  onComplete: jest.fn(),
  handleUserInputFormSubmit: jest.fn(),
  maxFeePerGas: '20',
  maxPriorityFeePerGas: '1'
};

function getComponent(props: TokenMigrationProps) {
  return simpleRender(<TokenMigrationForm {...((props as unknown) as any)} />, {
    initialState: mockAppState({
      accounts: fAccounts,
      assets: fAssets,
      networks: APP_STATE.networks
    })
  });
}

/* Test components */
describe('TokenMigrationForm', () => {
  test('Can render the first step (Token Migration Form) in the flow.', () => {
    const { getByText } = getComponent(defaultProps);
    const selector = translateRaw('REP_TOKEN_MIGRATION');
    expect(getByText(selector)).toBeInTheDocument();
  });
});
