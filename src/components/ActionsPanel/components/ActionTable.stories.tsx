import { ComponentProps } from 'react';

import { fAccounts, fAssets } from '@fixtures';

import { ActionTable } from './ActionTable';

const defaultProps: ComponentProps<typeof ActionTable> = {
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

export default { title: 'Molecules/ActionTable', component: ActionTable };

export const Default = () => {
  return <ActionTable {...defaultProps} />;
};
