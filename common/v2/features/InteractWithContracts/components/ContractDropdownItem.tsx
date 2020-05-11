import React from 'react';
import styled from 'styled-components';

import { Contract } from '@types';

const OptionWrapper = styled.div`
  padding: 12px 15px;
`;

interface Props {
  option: Contract;
  onSelect?(option: Contract): void;
}

export default function ContractDropdownItem(props: Props) {
  const { option, onSelect } = props;

  return <OptionWrapper onClick={() => onSelect && onSelect(option)}>{option.name}</OptionWrapper>;
}
