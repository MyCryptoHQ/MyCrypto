import React from 'react';
import Select, { OptionComponentProps, ArrowRendererProps } from 'react-select';
import styled from 'styled-components';
import { Icon } from '@mycrypto/ui';

import { COLORS } from 'v2/theme';

const { SILVER } = COLORS;
// Give a height to the input when value is defined
// Overide custom styles common/sass/styles/overrides/react-select.scss
interface SProps {
  value?: string;
  disabled?: boolean;
}

const SSelect = styled(Select)`
  height: ${(props: SProps) => (props.value ? 'auto' : '54px')};
  background-color: ${(props: SProps) => (props.disabled ? SILVER : 'default')};
  ${props => props.disabled && '.Select-arrow {display: none};'}
  font-size: 16px;

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
  name?: string;
  optionComponent?:
    | React.ComponentClass<OptionComponentProps<T>>
    | React.StatelessComponent<OptionComponentProps<T>>;
  valueComponent?: React.ComponentClass<T> | React.StatelessComponent<T>;
  onChange?(option: T): void;
}

const Chevron = styled(Icon)`
  font-size: 0.75rem;
`;

const DropdownIndicator = (props: ArrowRendererProps) => (
  <Chevron icon={props.isOpen ? 'chevronUp' : 'chevronDown'} />
);

export default function Dropdown({
  onChange,
  options,
  optionComponent,
  value,
  valueComponent,
  placeholder,
  disabled,
  searchable,
  name // field name for hidden input. Important for Formik
}: Props<any>) {
  return (
    <SSelect
      arrowRenderer={DropdownIndicator}
      clearable={false}
      menuContainerStyle={{ maxHeight: '65vh', borderTop: '1px solid #ececec' }}
      menuStyle={{ maxHeight: '65vh' }}
      name={name}
      onChange={onChange}
      options={options}
      optionComponent={optionComponent}
      placeholder={placeholder}
      searchable={searchable}
      value={value} //!! value must be an expression or an object !?
      valueComponent={valueComponent}
      disabled={disabled}
    />
  );
}
