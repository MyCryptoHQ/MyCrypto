import React from 'react';
import { translateRaw } from 'v2/translations';
import { formatEther } from 'ethers/utils';

import { AccountSummary, AccountOption, Dropdown } from 'v2/components';
import { StoreAccount, Asset } from 'v2/types';
import { getAccountBalance, getBaseAsset } from 'v2/services/Store';
import { useEffectOnce } from 'v2/vendor';

// Option item displayed in Dropdown menu. Props are passed by react-select Select.
// To know: Select needs to receive a class in order to attach refs https://github.com/JedWatson/react-select/issues/2459
// Since Account summary is using Address which still has the 'copy', we must handle hover ourself.

interface IAccountDropdownProps {
  accounts: StoreAccount[];
  name: string;
  value: StoreAccount;
  asset?: Asset;
  onSelect(option: StoreAccount): void;
}

function AccountDropdown({ accounts, name, value, onSelect, asset }: IAccountDropdownProps) {
  const relevantAccounts: StoreAccount[] = accounts.map(account => ({
    ...account,
    balance: formatEther(asset ? getAccountBalance(account, asset) : getAccountBalance(account)),
    assetSymbol: asset ? asset.ticker : getBaseAsset(account)!.ticker
  }));

  useEffectOnce(() => {
    // preselect first value from options
    if ((!value || !value.address) && relevantAccounts.length > 0) {
      onSelect(relevantAccounts[0]);
    }
  });

  return (
    <Dropdown
      name={name}
      placeholder={translateRaw('ACCOUNT_SELECTION_PLACEHOLDER')}
      options={relevantAccounts}
      onChange={option => onSelect(option)}
      optionComponent={AccountOption}
      value={value && value.address ? value : undefined} // Allow the value to be undefined at the start in order to display the placeholder
      valueComponent={({ value: { label, address, balance, assetSymbol } }) => (
        <AccountSummary
          address={address}
          balance={balance}
          label={label}
          assetSymbol={assetSymbol}
        />
      )}
    />
  );
}

export default AccountDropdown;
