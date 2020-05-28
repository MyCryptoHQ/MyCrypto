import React from 'react';

import { Contract } from '@types';

import ContractDropdownItem from './ContractDropdownItem';
import { OptionProps } from 'react-select';

export default function ContractDropdownOption(props: OptionProps<Contract>) {
  const { data, setValue } = props;
  return <ContractDropdownItem data={data} setValue={setValue} />;
}
