import { FocusEventHandler, KeyboardEventHandler } from 'react-select';

import { AccountSummary, Icon } from '@components';
import { SPACING } from '@theme';
import { translateRaw } from '@translations';
import { Asset, IReceiverAddress } from '@types';

import Box from './Box';
import Selector, { ClearIndicatorWrapper, DropdownIndicatorWrapper } from './Selector';

export interface LabeledAddress {
  label: string;
  address: string;
}

interface Props {
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

const AddressLookupSelector = ({
  inputValue,
  options,
  name,
  value,
  onSelect,
  onBlur,
  onInputChange,
  onEnterKeyDown,
  placeholder
}: Props) => (
  <Selector<LabeledAddress>
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
    isClearable={true}
    onCloseResetsInput={false}
    onBlurResetsInput={false}
    components={{
      // Interaction of the indicator is handled by the imported wrapper.
      DropdownIndicator: ({ hasValue, ...props }) => {
        // When a value is selected, we hide the indicator to allow the
        // ClearIndicator to takes it's place.
        return !hasValue ? (
          <DropdownIndicatorWrapper hasValue={hasValue} {...props}>
            <Icon type="address-book" width="1em" mr="2px" />
          </DropdownIndicatorWrapper>
        ) : (
          <></>
        );
      },
      ClearIndicator: (props) => (
        <ClearIndicatorWrapper {...props}>
          <Box width="16px" variant="rowCenter">
            <Icon type="remove" size="0.6em" mr="2px" />
          </Box>
        </ClearIndicatorWrapper>
      )
    }}
  />
);

export default AddressLookupSelector;
