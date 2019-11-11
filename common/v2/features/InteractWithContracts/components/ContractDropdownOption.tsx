import React from 'react';

import { Contract } from 'v2/types';

import ContractDropdownItem from './ContractDropdownItem';

interface Props {
  option: Contract;
  onSelect(option: Contract): void;
}

export default function ContractDropdownOption(props: Props) {
  const { option, onSelect } = props;
  return <ContractDropdownItem option={option} onSelect={onSelect} />;
}
