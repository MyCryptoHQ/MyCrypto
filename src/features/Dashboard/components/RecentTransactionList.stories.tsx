import React from 'react';

import { fAccounts } from '@fixtures';

import RecentTransactionList from './RecentTransactionList';

const defaultProps: React.ComponentProps<typeof RecentTransactionList> = {
  accountsList: fAccounts
};

export default { title: 'Organisms/RecentTransactionList', component: RecentTransactionList };

export const Default = () => {
  return <RecentTransactionList {...defaultProps} />;
};
