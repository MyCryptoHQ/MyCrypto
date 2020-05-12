import React from 'react';
import { OnInputKeyDownHandler } from 'react-select';

import { translateRaw } from '@translations';
import { AccountSummary, AccountOption, Dropdown } from '@components';
import { Asset, IReceiverAddress, ExtendedAddressBook } from '@types';

import addressBookIcon from '@assets/images/icn-address-book.svg';

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
    valueComponent={({ value: { value: address, assetUUID, display: label } }) => (
      <AccountSummary uuid={assetUUID} address={address} label={label} />
    )}
    searchable={true}
    clearable={true}
    onCloseResetsInput={false}
    onBlurResetsInput={false}
  />
);

export default ContactLookupDropdown;
