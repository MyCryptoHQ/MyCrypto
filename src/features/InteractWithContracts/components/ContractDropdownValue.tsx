import React from 'react';

import { Contract } from '@types';

import ContractDropdownItem from './ContractDropdownItem';

interface Props {
  value: Contract;
}

export default function ContractDropdownValue(props: Props) {
  const { value } = props;
  return <ContractDropdownItem option={value} />;
}
