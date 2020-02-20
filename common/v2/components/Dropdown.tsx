import React from 'react';
import Select, {
  OptionComponentProps,
  ArrowRendererProps,
  OnInputChangeHandler,
  OnInputKeyDownHandler
} from 'react-select';
import styled from 'styled-components';
import { Icon } from '@mycrypto/ui';
import crossIcon from 'common/assets/images/icn-cross.svg';

import { COLORS, FONT_SIZE } from 'v2/theme';

// Give a height to the input when value is defined
// Overide custom styles common/sass/styles/overrides/react-select.scss
interface SProps {
  value?: string;
  disabled?: boolean;
}

const SSelect = styled(Select)`
  height: ${(props: SProps) => (props.value ? 'auto' : '54px')};
  background-color: ${(props: SProps) => (props.disabled ? COLORS.GREY_LIGHTEST : 'default')};
  ${props => props.disabled && '.Select-arrow {display: none};'} font-size: ${FONT_SIZE.BASE};

  /* Set max-height to prevent the dropdown form overflowing the footer. */
  .Select-menu {
    max-height: 20em !important;
  }
`;

interface Props<T> {
  options: T[];
  value: T;
  disabled?: boolean;
  placeholder?: string;
  searchable?: boolean;
  clearable?: boolean;
  name?: string;
  dropdownIcon?: JSX.Element;
  optionComponent?:
    | React.ComponentClass<OptionComponentProps<T>>
    | React.StatelessComponent<OptionComponentProps<T>>;
  valueComponent?: React.ComponentClass<T> | React.StatelessComponent<T>;
  inputValue?: string;
  onInputChange?: OnInputChangeHandler;
  onInputKeyDown?: OnInputKeyDownHandler;
  onChange?(option: T): void;
  onBlur?(e: string | undefined): void;
}

const Chevron = styled(Icon)`
  font-size: 0.75rem;
`;
const IconWrapper = styled('div')`
  width: 30px;
`;

const DropdownIndicator = (props: ArrowRendererProps) => (
  <Chevron icon={props.isOpen ? 'chevronUp' : 'chevronDown'} />
);
const CustomDropdownIndicator = (dropdownIcon: JSX.Element) => () => (
  <IconWrapper>{dropdownIcon}</IconWrapper>
);
const ClearIndicator = () => (
  <IconWrapper>
    <img src={crossIcon} />
  </IconWrapper>
);

export default function Dropdown({
  onChange,
  onBlur,
  options,
  optionComponent,
  value,
  valueComponent,
  placeholder,
  disabled,
  searchable,
  clearable = false,
  inputValue,
  onInputChange,
  name, // field name for hidden input. Important for Formik
  onInputKeyDown,
  dropdownIcon
}: Props<any>) {
  // AccountLookup dropdown is using custom dropdown indicator (dropdownIcon) and clear field indicator. When value is set, it hides dropdown icon, so that clear icon can appear instead of it.
  const resolveDropdownIcon = dropdownIcon
    ? value
      ? null
      : CustomDropdownIndicator(dropdownIcon)
    : DropdownIndicator;

  return (
    <SSelect
      arrowRenderer={resolveDropdownIcon}
      clearRenderer={ClearIndicator}
      clearable={clearable}
      menuContainerStyle={{ maxHeight: '65vh', borderTop: '1px solid #ececec' }}
      menuStyle={{ maxHeight: '65vh' }}
      name={name}
      onChange={onChange}
      onInputChange={onInputChange}
      onBlur={onBlur ? () => onBlur(inputValue) : undefined}
      options={options}
      optionComponent={optionComponent}
      placeholder={placeholder}
      searchable={searchable}
      value={value} //!! value must be an expression or an object !?
      valueComponent={valueComponent}
      disabled={disabled}
      onInputKeyDown={onInputKeyDown}
    />
  );
}
