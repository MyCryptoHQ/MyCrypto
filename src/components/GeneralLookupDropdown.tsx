import React from 'react';
import { OnInputKeyDownHandler } from 'react-select';

import { translateRaw } from '@translations';
import { AccountSummary, AccountOption, Dropdown } from '@components';
import { Asset, IReceiverAddress } from '@types';

import addressBookIcon from '@assets/images/icn-address-book.svg';

export interface LabeledAddress {
  label: string;
  address: string;
}

interface IGeneralLookupDropdownProps {
  options: LabeledAddress[];
  name: string;
  value: IReceiverAddress;
  asset?: Asset;
  onEnterKeyDown: OnInputKeyDownHandler;
  inputValue: string;
  placeholder?: string;
  onSelect(option: IReceiverAddress): void;
  onChange?(e: any): void;
  onInputChange(e: any): string;
  onBlur(inputString: string): void;
}

const GeneralLookupDropdown = ({
  inputValue,
  options,
  name,
  value,
  onSelect,
  onBlur,
  onInputChange,
  onEnterKeyDown,
  placeholder
}: IGeneralLookupDropdownProps) => (
  <Dropdown
    dropdownIcon={<img src={addressBookIcon} />}
    onInputKeyDown={onEnterKeyDown}
    inputValue={inputValue}
    name={name}
    placeholder={placeholder ? placeholder : translateRaw('ACCOUNT_LOOKUP_SELECTION_PLACEHOLDER')}
    options={options.map((o) => ({ value: o.address, ...o }))}
    onChange={(option: LabeledAddress) => {
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

export default GeneralLookupDropdown;
