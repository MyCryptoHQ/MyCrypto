import React from 'react';
import { translateRaw } from '@translations';
import { formatEther } from 'ethers/utils/units';

import { AccountSummary, AccountOption, Dropdown } from '@components';
import { StoreAccount, Asset } from '@types';
import { getAccountBalance, getBaseAsset } from '@services/Store';
import { useEffectOnce } from '@vendor';

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

const sortByLabel = (a: Option, b: Option) => a.label.localeCompare(b.label);

type Option = StoreAccount & { balance: string; assetSymbol: string };

function AccountDropdown({ accounts, name, value, onSelect, asset }: IAccountDropdownProps) {
  const relevantAccounts: Option[] = accounts
    .map((account) => ({
      ...account,
      balance: formatEther(asset ? getAccountBalance(account, asset) : getAccountBalance(account)),
      assetUUID: asset ? asset.uuid : getBaseAsset(account)!.uuid,
      assetSymbol: asset ? asset.ticker : getBaseAsset(account)!.ticker
    }))
    .sort(sortByLabel);

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
      onChange={(option) => onSelect(option)}
      optionComponent={AccountOption}
      value={value && value.address ? value : undefined} // Allow the value to be undefined at the start in order to display the placeholder
      valueComponent={({ value: { uuid, label, address, balance, assetSymbol, assetUUID } }) => {
        const option = relevantAccounts.find((a) => a.uuid === uuid);
        return (
          <AccountSummary
            address={address}
            balance={option ? option.balance : balance}
            label={label}
            uuid={assetUUID}
            assetSymbol={option ? option.assetSymbol : assetSymbol}
          />
        );
      }}
    />
  );
}

export default AccountDropdown;
