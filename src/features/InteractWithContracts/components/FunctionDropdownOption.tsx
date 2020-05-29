import React from 'react';
import { OptionProps } from 'react-select';

import FunctionDropdownItem from './FunctionDropdownItem';
import { ABIItem } from '../types';

export default function FunctionDropdownOption(props: OptionProps<ABIItem>) {
  const { data, selectOption } = props;
  return <FunctionDropdownItem data={data} selectOption={selectOption} />;
}
