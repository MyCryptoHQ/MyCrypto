import React from 'react';

import FunctionDropdownItem from './FunctionDropdownItem';
import { ABIItem } from '../types';

interface Props {
  value: ABIItem;
}

export default function FunctionDropdownValue(props: Props) {
  const { value } = props;
  return <FunctionDropdownItem option={value} />;
}
