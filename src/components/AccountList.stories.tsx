import React from 'react';

import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

import { fAccounts } from '@fixtures';
import { StoreProvider } from '@services';

import AccountListComponent from './AccountList';

export default {
  title: 'Organisms/AccountList',
  component: AccountListComponent,
  parameters: {
    viewports: {
      viewports: INITIAL_VIEWPORTS
    }
  }
};

const Template = (args: React.ComponentProps<typeof AccountListComponent>) => (
  <StoreProvider>
    <AccountListComponent {...args} />
  </StoreProvider>
);

// displayAccounts, className, deletable, copyable, (privacyCheckboxEnabled = false), dashboard;

export const Desktop = Template.bind({});
Desktop.args = {
  accounts: fAccounts
};
