import React from 'react';
import { OptionProps } from 'react-select';

import FunctionDropdownItem from './FunctionDropdownItem';
import { ABIItem } from '../types';

export default function FunctionDropdownOption({ data, selectOption }: OptionProps<ABIItem>) {
  return <FunctionDropdownItem option={data} onSelect={selectOption} />;
}
