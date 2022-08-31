import { ComponentProps } from 'react';

import selectEvent from 'react-select-event';
import { fireEvent, screen, simpleRender } from 'test-utils';

import { fAccounts } from '@fixtures';
import { sortByLabel } from '@utils';

import AccountSelector from './AccountSelector';

type Props = ComponentProps<typeof AccountSelector>;

function getComponent(props: Props) {
  return simpleRender(
    <form role="form">
      <AccountSelector {...props} />
    </form>
  );
}

const defaultProps = {
  accounts: fAccounts,
  name: '',
  showAssetName: true,
  value: sortByLabel(fAccounts)[0],
  onSelect: jest.fn()
};

describe('AccountSelector', () => {
  test('it displays account info by default', async () => {
    getComponent(defaultProps);
    const accounts = sortByLabel(defaultProps.accounts);
    // Displays the account label
    expect(screen.getByText(new RegExp(accounts[0].label, 'i'))).toBeDefined();
    // Displays the account networks baseAsset when no asset is provided
    expect(screen.getByText(new RegExp(accounts[0].assets[0].ticker, 'i'))).toBeInTheDocument();
  });

  test('it sorts the accounts alphabetically', async () => {
    getComponent(defaultProps);
    const accounts = sortByLabel(defaultProps.accounts);
    expect(screen.getByText(new RegExp(accounts[0].label, 'i'))).toBeDefined();
    // defaultProps is not sorted, so expect the first account to be absent.
    // use queryBy to assert that element is not present
    // https://testing-library.com/docs/guide-disappearance#asserting-elements-are-not-present
    expect(screen.queryByText(new RegExp(defaultProps.accounts[0].label, 'i'))).toBeNull();
  });

  test('it displays the list of accounts on click', async () => {
    getComponent(defaultProps);
    const accounts = sortByLabel(defaultProps.accounts);

    await selectEvent.openMenu(screen.getByText(accounts[0].label));

    defaultProps.accounts
      .map((a) => a.label)
      // UI spec, says when an Account is selected it should be displayed in the input AND in the list,
      // so we use `getAllByText` to reflect the duplication.
      .forEach((t) => expect(screen.getAllByText(t).length).toBeGreaterThanOrEqual(1));
  });

  test('it calls the success handler with the correct value', async () => {
    getComponent(defaultProps);
    const accounts = sortByLabel(defaultProps.accounts);

    // expect(screen.getByRole('form')).toHaveFormValues({ [accounts[0].label!]: '' });
    await selectEvent.openMenu(screen.getByText(new RegExp(accounts[0].label, 'i')));
    const option = screen.getByText(new RegExp(accounts[1].label, 'i'));
    fireEvent.pointerDown(option);
    expect(defaultProps.onSelect).toHaveBeenCalledWith(accounts[1]);
  });
});
