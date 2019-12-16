import React from 'react';

import FunctionDropdownItem from './FunctionDropdownItem';
import { ABIItem } from '../types';

interface Props {
  option: ABIItem;
  onSelect(option: ABIItem): void;
}

export default function FunctionDropdownOption(props: Props) {
  const { option, onSelect } = props;
  return <FunctionDropdownItem option={option} onSelect={onSelect} />;
}
