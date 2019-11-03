import React from 'react';
import Select, { OptionComponentProps } from 'react-select';
import styled from 'styled-components';

// Give a height to the input when value is defined
// Overide custom styles common/sass/styles/overrides/react-select.scss
interface SProps {
  value?: string;
}

const SSelect = styled(Select)`
  height: ${(props: SProps) => (props.value ? 'auto' : '3rem')};
`;

interface Props<T> {
  options: T[];
  value: T;
  placeholder?: string;
  searchable?: boolean;
  name?: string;
  optionComponent?:
    | React.ComponentClass<OptionComponentProps<T>>
    | React.StatelessComponent<OptionComponentProps<T>>;
  valueComponent?: React.ComponentClass<T> | React.StatelessComponent<T>;
  onChange(option: T): void;
}

export default function Dropdown({
  onChange,
  options,
  optionComponent,
  value,
  valueComponent,
  placeholder,
  searchable,
  name // field name for hidden input. Important for Formik
}: Props<any>) {
  return (
    <SSelect
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
    />
  );
}
