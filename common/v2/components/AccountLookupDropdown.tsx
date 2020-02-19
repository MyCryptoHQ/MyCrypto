import React from 'react';
import { OnInputKeyDownHandler } from 'react-select';

import { translateRaw } from 'v2/translations';
import { AccountSummary, AccountOption, Dropdown } from 'v2/components';
import { Asset, IReceiverAddress, ExtendedAddressBook } from 'v2/types';

// Option item displayed in Dropdown menu. Props are passed by react-select Select.
// To know: Select needs to receive a class in order to attach refs https://github.com/JedWatson/react-select/issues/2459
// Since Account summary is using Address which still has the 'copy', we must handle hover ourself.

interface IAccountLookupDropdownProps {
  accounts: ExtendedAddressBook[];
  name: string;
  value: IReceiverAddress;
  asset?: Asset;
  onEnterKeyDown: OnInputKeyDownHandler;
  inputValue: string;
  onSelect(option: IReceiverAddress): void;
  onChange?(e: any): void;
  onInputChange(e: any): string;
  onBlur(e: any): void;
}

function AccountLookupDropdown({
  inputValue,
  accounts,
  name,
  value,
  onSelect,
  onBlur,
  onInputChange,
  onEnterKeyDown
}: IAccountLookupDropdownProps) {
  const relevantAccounts: ExtendedAddressBook[] =
    accounts &&
    accounts.map(account => ({
      ...account,
      hideCurrency: true // hide currency field in dropdown optionComponent
    }));

  return (
    <Dropdown
      onInputKeyDown={onEnterKeyDown}
      inputValue={inputValue}
      name={name}
      placeholder={translateRaw('ACCOUNT_LOOKUP_SELECTION_PLACEHOLDER')}
      options={relevantAccounts}
      onChange={option => {
        onSelect({
          display: option.label,
          value: option.address
        });
      }}
      onInputChange={onInputChange}
      onBlur={onBlur}
      optionComponent={AccountOption}
      value={value && value.value ? value : undefined} // Allow the value to be undefined at the start in order to display the placeholder
      valueComponent={({ value: { value: address, display: label, balance, assetSymbol } }) => (
        <AccountSummary
          address={address}
          balance={balance}
          label={label}
          assetSymbol={assetSymbol}
          selectable={false}
          hideCurrency={true}
        />
      )}
      searchable={true}
    />
  );
}

export default AccountLookupDropdown;
