import React from 'react';

import { simpleRender } from 'test-utils';

import { fAccounts } from '@fixtures';
import { translateRaw } from '@translations';

import BuyAssetsForm from './BuyAssetsForm';

function getComponent() {
  return simpleRender(<BuyAssetsForm />);
}

describe('BuyAssetsForm', () => {
  test('it renders', async () => {
    const { getByText } = getComponent();
    expect(getByText(translateRaw('DASHBOARD_ACTIONS_BUY_TITLE'))).toBeInTheDocument();
    expect(getByText(fAccounts[0].label)).toBeInTheDocument();
  });
});
