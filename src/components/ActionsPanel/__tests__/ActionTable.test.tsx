import { screen, simpleRender } from 'test-utils';

import { fAccounts, fAssets } from '@fixtures';
import { translateRaw } from '@translations';
import { truncate } from '@utils';

import { ActionTable, ActionTableProps } from '../components/ActionTable';

function getComponent(props: ActionTableProps) {
  return simpleRender(<ActionTable {...props} />);
}

describe('ActionTable', () => {
  const defaultProps = {
    accounts: [
      {
        address: fAccounts[0].address,
        amount: fAccounts[0].assets[0].balance.toString()
      },
      {
        address: fAccounts[2].address,
        amount: fAccounts[2].assets[0].balance.toString()
      }
    ],
    asset: fAssets[0]
  };

  it('display a table with multiple address and balance of the given asset', () => {
    getComponent(defaultProps);

    expect(screen.getByText(new RegExp(translateRaw('ADDRESS'), 'i'))).toBeDefined();
    expect(screen.getByText(new RegExp(translateRaw('BALANCE'), 'i'))).toBeDefined();
    expect(screen.getByText(new RegExp(truncate(fAccounts[0].address), 'i'))).toBeDefined();
    expect(screen.getByText(new RegExp(truncate(fAccounts[2].address), 'i'))).toBeDefined();
    expect(screen.getAllByText(new RegExp(fAssets[0].ticker, 'i'))).toBeDefined();
  });
});
