import React from 'react';

import { translateRaw } from 'translations';
import { ExtendedAccount as IExtendedAccount } from 'v2/types';
import { AccountSummary, AccountOption, Dropdown } from 'v2/components';

// Option item displayed in Dropdown menu. Props are passed by react-select Select.
// To know: Select needs to receive a class in order to attach refs https://github.com/JedWatson/react-select/issues/2459
// Since Account summary is using Address which still has the 'copy', we must handle hover ourself.

function AccountDropdown({ accounts, name, value, onSelect }: IAccountDropdown) {
  return (
    <Dropdown
      name={name}
      placeholder={translateRaw('ACCOUNT_SELECTION_PLACEHOLDER')}
      options={accounts}
      onChange={option => onSelect(option)}
      optionComponent={AccountOption}
      value={value && value.address ? value : undefined} // Allow the value to be undefined at the start in order to display the placeholder
      valueComponent={({ value: { label, address, balance } }) => (
        <AccountSummary address={address} balance={balance} label={label} selectable={false} />
      )}
    />
  );
}

interface IAccountDropdown {
  accounts: IExtendedAccount[];
  name: string;
  value: IExtendedAccount;
  onSelect(option: IExtendedAccount): void;
}

export default AccountDropdown;
