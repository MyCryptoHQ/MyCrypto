import React from 'react';
import { fAccounts, fAssets } from '@fixtures';

import { noOp } from '@utils';
import AccountSelector from './AccountSelector';
import AccountSummary from './AccountSummary';

export default { title: 'Selectors/AccountSelector' };

const initialProps: React.ComponentProps<typeof AccountSelector> = {
  accounts: fAccounts,
  name: '',
  value: null,
  onSelect: noOp
};

export const Selector = () => {
  const withAsset = { ...initialProps, asset: fAssets[0] };
  return (
    <div className="sb-container">
      <form role="form">
        <AccountSelector clearable={true} {...initialProps} />
      </form>
      <form role="form">
        <AccountSelector clearable={true} {...withAsset} />
      </form>
    </div>
  );
};

export const DropdownItem = () => {
  const account = initialProps.accounts[0];
  return (
    <div className="sb-container" style={{ width: '100%', maxWidth: '300px' }}>
      <AccountSummary address={account.address} label={account.label} />
    </div>
  );
};
