import React from 'react';

import FunctionDropdownItem from './FunctionDropdownItem';
import { ABIItem } from '../types';
import { ActionTypes, ValueType } from 'react-select';

interface Props {
  value: ABIItem;
  setValue?(value: ValueType<ABIItem>, action: ActionTypes): void;
}

export default function FunctionDropdownOption(props: Props) {
  return <FunctionDropdownItem {...props} />;
}
