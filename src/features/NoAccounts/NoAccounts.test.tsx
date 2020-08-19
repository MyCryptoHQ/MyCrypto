import React from 'react';

import { simpleRender, screen } from 'test-utils';
import { default as NoAccounts } from './NoAccounts';

const getComponent = () => {
  return simpleRender(<NoAccounts />);
};

describe('NoAccounts', () => {
  test('displays no account message', () => {
    getComponent();
    expect(screen.getByText(/any accounts in your wallet/)).toBeInTheDocument();
  });
});
