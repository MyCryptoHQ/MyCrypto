import React from 'react';
import { OnInputKeyDownHandler } from 'react-select';

import { translateRaw } from 'v2/translations';
import { AccountSummary, AccountOption, Dropdown } from 'v2/components';
import { Asset, IReceiverAddress, ExtendedAddressBook } from 'v2/types';

import addressBookIcon from 'common/assets/images/icn-address-book.svg';

interface IAccountLookupDropdownProps {
  contacts: ExtendedAddressBook[];
  name: string;
  value: IReceiverAddress;
  asset?: Asset;
  onEnterKeyDown: OnInputKeyDownHandler;
  inputValue: string;
  onSelect(option: IReceiverAddress): void;
  onChange?(e: any): void;
  onInputChange(e: any): string;
  onBlur(inputString: string): void;
}

const ContactLookupDropdown = ({
  inputValue,
  contacts,
  name,
  value,
  onSelect,
  onBlur,
  onInputChange,
  onEnterKeyDown
}: IAccountLookupDropdownProps) => (
  <Dropdown
    dropdownIcon={<img src={addressBookIcon} />}
    onInputKeyDown={onEnterKeyDown}
    inputValue={inputValue}
    name={name}
    placeholder={translateRaw('ACCOUNT_LOOKUP_SELECTION_PLACEHOLDER')}
    options={contacts}
    onChange={(option: ExtendedAddressBook) => {
      onSelect({
        display: option ? option.label : '',
        value: option ? option.address : ''
      });
    }}
    onInputChange={onInputChange}
    onBlur={onBlur}
    optionComponent={AccountOption}
    value={value && value.value ? value : undefined} // Allow the value to be undefined at the start in order to display the placeholder
    valueComponent={({ value: { value: address, display: label } }) => (
      <AccountSummary address={address} label={label} selectable={false} />
    )}
    searchable={true}
    clearable={true}
  />
);

export default ContactLookupDropdown;
