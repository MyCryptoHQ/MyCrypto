import React from 'react';
import { OptionProps } from 'react-select';

import { Contract } from '@types';
import ContractDropdownItem from './ContractDropdownItem';

export default function ContractDropdownOption(props: OptionProps<Contract>) {
  const { data, selectOption } = props;
  return <ContractDropdownItem data={data} selectOption={selectOption} />;
}
