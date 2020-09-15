import React from 'react';

import { OptionProps } from 'react-select';

import { ABIItem } from '../types';
import FunctionDropdownItem from './FunctionDropdownItem';

export default function FunctionDropdownOption({ data, selectOption }: OptionProps<ABIItem>) {
  return <FunctionDropdownItem option={data} onSelect={selectOption} />;
}
