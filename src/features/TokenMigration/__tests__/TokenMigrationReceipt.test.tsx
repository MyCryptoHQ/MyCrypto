import { mockAppState, simpleRender } from 'test-utils';

import { repTokenMigrationConfig } from '@features/RepTokenMigration/config';
import { fAccounts, fTokenMigrationTxs } from '@fixtures';
import { translateRaw } from '@translations';

import TokenMigrationReceipt, {
  TokenMigrationReceiptProps
} from '../components/TokenMigrationReceipt';

const defaultProps: TokenMigrationReceiptProps = {
  flowConfig: repTokenMigrationConfig,
  account: fAccounts[0],
  amount: '4',
  transactions: fTokenMigrationTxs(),
  onComplete: jest.fn()
};

function getComponent(props: TokenMigrationReceiptProps) {
  return simpleRender(<TokenMigrationReceipt {...props} />, {
    initialState: mockAppState({ accounts: fAccounts })
  });
}

/* Test components */
describe('TokenMigrationReceipt', () => {
  test('Can render the TokenMigrationReceipt', () => {
    const { getByText } = getComponent(defaultProps);
    const selector = translateRaw('TRANSACTION_BROADCASTED_BACK_TO_DASHBOARD');
    expect(getByText(selector)).toBeInTheDocument();
  });
});
