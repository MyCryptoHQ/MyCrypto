import React from 'react';
import { FocusEventHandler, KeyboardEventHandler } from 'react-select/src/types';

import { translateRaw } from '@translations';
import { AccountSummary, AccountOption, Dropdown } from '@components';
import { Asset, IReceiverAddress, ExtendedAddressBook } from '@types';
import { SPACING } from '@theme';

import addressBookIcon from '@assets/images/icn-address-book.svg';

interface IAccountLookupDropdownProps {
  onEnterKeyDown: KeyboardEventHandler;
  contacts: ExtendedAddressBook[];
  name: string;
  value: IReceiverAddress;
  asset?: Asset;
  inputValue: string;
  onBlur: FocusEventHandler;
  onSelect(option: IReceiverAddress): void;
  onChange?(e: any): void;
  onInputChange(e: any): string;
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
  <Dropdown<any>
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
      <AccountSummary uuid={assetUUID} address={address} label={label} paddingLeft={SPACING.XS} />
    )}
    searchable={true}
    clearable={true}
    onCloseResetsInput={false}
    onBlurResetsInput={false}
  />
);

export default ContactLookupDropdown;
