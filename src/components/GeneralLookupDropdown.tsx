import React from 'react';

import { FocusEventHandler, KeyboardEventHandler } from 'react-select';

import { AccountSummary, Box, Icon, Selector } from '@components';
import { SPACING } from '@theme';
import { translateRaw } from '@translations';
import { Asset, IReceiverAddress } from '@types';

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
  <Selector
    dropdownIcon={
      <Box variant="rowCenter" mr="2px">
        <Icon type="address-book" width="1em" />
      </Box>
    }
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
    optionDivider={true}
    optionComponent={({ data: { address, label }, selectOption }) => (
      <AccountSummary
        address={address}
        label={label}
        paddingLeft={SPACING.SM}
        onClick={() => selectOption({ address, label })}
      />
    )}
    value={value && value.value ? { label: value.display, address: value.value } : undefined} // Allow the value to be undefined at the start in order to display the placeholder
    valueComponent={({ value: { address, label } }) => (
      <AccountSummary address={address} label={label} paddingLeft={SPACING.NONE} />
    )}
    searchable={true}
    clearable={true}
    onCloseResetsInput={false}
    onBlurResetsInput={false}
  />
);

export default GeneralLookupDropdown;
