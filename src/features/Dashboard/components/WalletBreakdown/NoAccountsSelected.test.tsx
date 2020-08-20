import React from 'react';
import { simpleRender } from 'test-utils';

import { translateRaw } from '@translations';
import { default as NoAccountsSelected } from './NoAccountsSelected';

describe('NoAccountsSelected', () => {
  test('Translations are rendered', () => {
    const { getByText } = simpleRender(<NoAccountsSelected />);

    expect(getByText(translateRaw('NO_ACCOUNTS_SELECTED_HEADER'))).toBeInTheDocument();
    expect(getByText(translateRaw('NO_ACCOUNTS_SELECTED_HEADER'))).not.toEqual(
      'NO_ACCOUNTS_SELECTED_HEADER'
    );

    expect(getByText(translateRaw('NO_ACCOUNTS_SELECTED_DESCRIPTION'))).toBeInTheDocument();
    expect(getByText(translateRaw('NO_ACCOUNTS_SELECTED_DESCRIPTION'))).not.toEqual(
      'NO_ACCOUNTS_SELECTED_DESCRIPTION'
    );
  });
});
