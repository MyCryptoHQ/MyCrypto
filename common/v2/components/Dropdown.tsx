import React, { ReactElement, forwardRef } from 'react';
import Select, { Option } from 'react-select';
import styled from 'styled-components';

interface SProps {
  value?: string
}

interface Props {
  options: Option[];
  value: any;
  placeholder?: string;
  name?: string;
  onChange(option: Option): void;
  valueComponent?(value: Option): ReactElement<any>;
  optionComponent?(option: Option): ReactElement<any>;
}

// Overide custom styles common/sass/styles/overrides/react-select.scss
const SSelect = styled(Select)`
  height: ${(props:SProps) => props.value ? 'auto' : '3rem'};
`

export default function Dropdown({
  onChange,
  options,
  optionComponent,
  value,
  valueComponent,
  placeholder,
  name,         // field name for hidden input. Important for Formik
  ...props
}:Props) {

  return (
    <SSelect
      clearable={false}
      menuContainerStyle={{ maxHeight: '65vh', borderTop: '1px solid #ececec'}}
      menuStyle={{ maxHeight: '65vh'}}
      name={name}
      onChange={onChange}
      options={options}
      optionComponent={optionComponent}
      placeholder={placeholder}
      searchable={false}
      searchPromptText={'Find label'}
      value={value}
      valueComponent={valueComponent}
      {...props}
    />
  )
}
