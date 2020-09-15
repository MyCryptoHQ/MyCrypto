import React from 'react';

import { ABIItem } from '../types';
import FunctionDropdownItem from './FunctionDropdownItem';

interface Props {
  value: ABIItem;
}

export default function FunctionDropdownValue(props: Props) {
  const { value } = props;
  return <FunctionDropdownItem option={value} />;
}
