import React, { useState } from 'react';
import { fAccount, fAssets } from '@fixtures';

import { noOp } from '@utils';
import { StoreAccount } from '@types';
import AccountDropdown, { IAccountDropdownProps } from './AccountDropdown';
import AccountSummary from './AccountSummary';

export default { title: 'AccountDropdown' };

const initialProps: IAccountDropdownProps = {
  accounts: [fAccount, Object.assign({}, fAccount, { address: 'demo' })],
  asset: fAssets[0],
  name: '',
  value: null,
  onSelect: noOp
};

export const Selector = () => {
  const [formValues, setFormValues] = useState<StoreAccount>();

  const props = {
    ...initialProps,
    onSelect: setFormValues
  };

  return (
    <div className="sb-container" style={{ width: '100%', maxWidth: '300px' }}>
      <form role="form">
        <AccountDropdown clearable={true} {...props} />
      </form>
      <div>
        Value: {formValues ? formValues.address : 'undefined'}
        <pre>{JSON.stringify(fAccount, null, 2)}</pre>
      </div>
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
