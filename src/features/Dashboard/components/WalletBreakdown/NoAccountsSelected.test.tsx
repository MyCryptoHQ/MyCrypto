import { simpleRender } from 'test-utils';

import { translateRaw } from '@translations';

import { default as NoAccountsSelected } from './NoAccountsSelected';

describe('NoAccountsSelected', () => {
  test('Translations are rendered', () => {
    const { getByText } = simpleRender(<NoAccountsSelected />);

    const headerText = getByText(translateRaw('NO_ACCOUNTS_SELECTED_HEADER'));
    const descriptionText = getByText(translateRaw('NO_ACCOUNTS_SELECTED_DESCRIPTION'));

    expect(headerText).toBeInTheDocument();
    expect(headerText).not.toEqual('NO_ACCOUNTS_SELECTED_HEADER');

    expect(descriptionText).toBeInTheDocument();
    expect(descriptionText).not.toEqual('NO_ACCOUNTS_SELECTED_DESCRIPTION');
  });
});
