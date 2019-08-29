import React, { useContext } from 'react';
import { translateRaw } from 'translations';

import { AccountSummary, AccountOption, Dropdown } from 'v2/components';
import { StoreAccount } from 'v2/types';
import { AddressBookContext, getBaseAsset, getAccountBaseBalance } from 'v2/services/Store';
import { formatEther } from 'ethers/utils';

// Option item displayed in Dropdown menu. Props are passed by react-select Select.
// To know: Select needs to receive a class in order to attach refs https://github.com/JedWatson/react-select/issues/2459
// Since Account summary is using Address which still has the 'copy', we must handle hover ourself.

interface IAccountDropdownProps {
  accounts: StoreAccount[];
  name: string;
  value: StoreAccount;
  onSelect(option: StoreAccount): void;
}

function AccountDropdown({ accounts, name, value, onSelect }: IAccountDropdownProps) {
  const { getAccountLabel } = useContext(AddressBookContext);
  const relevantAccounts: StoreAccount[] = accounts.map(account => ({
    ...account,
    label: getAccountLabel(account),
    balance: formatEther(getAccountBaseBalance(account)),
    baseAssetSymbol: getBaseAsset(account)!.ticker
  }));

  return (
    <Dropdown
      name={name}
      placeholder={translateRaw('SEND_ASSETS_ACCOUNT_SELECTION_PLACEHOLDER')}
      options={relevantAccounts}
      onChange={option => onSelect(option)}
      optionComponent={AccountOption}
      value={value && value.address ? value : undefined} // Allow the value to be undefined at the start in order to display the placeholder
      valueComponent={({ value: { label, address, balance, baseAssetSymbol } }) => (
        <AccountSummary
          address={address}
          balance={balance}
          label={label}
          baseAssetSymbol={baseAssetSymbol}
          selectable={false}
        />
      )}
    />
  );
}

export default AccountDropdown;
