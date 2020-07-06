import React from 'react';
import { FocusEventHandler, KeyboardEventHandler } from 'react-select/src/types';

import { translateRaw } from '@translations';
import { AccountSummary, Divider, Dropdown } from '@components';
import { Asset, IReceiverAddress } from '@types';

import addressBookIcon from '@assets/images/icn-address-book.svg';
import { SPACING } from '@theme';

export interface LabeledAddress {
  label: string;
  address: string;
}

interface IGeneralLookupDropdownProps {
  options: LabeledAddress[];
  name: string;
  value: IReceiverAddress;
  asset?: Asset;
  onEnterKeyDown: KeyboardEventHandler;
  onBlur: FocusEventHandler;
  inputValue: string;
  placeholder?: string;
  onSelect(option: IReceiverAddress): void;
  onChange?(e: any): void;
  onInputChange(e: any): string;
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
    optionComponent={({ data, selectOption }) => {
      const { address, label } = data;
      return (
        <>
          <AccountSummary address={address} label={label} onClick={() => selectOption(data)} />
          <Divider padding={'14px'} />
        </>
      );
    }}
    value={!!value && { label: value.display, address: value.value }} // Allow the value to be undefined at the start in order to display the placeholder
    valueComponent={({ value: { address, label } }) => (
      <AccountSummary address={address} label={label} paddingLeft={SPACING.XS} />
    )}
    searchable={true}
    clearable={true}
    onCloseResetsInput={false}
    onBlurResetsInput={false}
  />
);

export default GeneralLookupDropdown;
