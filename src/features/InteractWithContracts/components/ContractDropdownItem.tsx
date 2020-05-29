import React from 'react';
import styled from 'styled-components';

import { Contract } from '@types';

const OptionWrapper = styled.div`
  padding: 12px 15px;
`;

interface Props {
  data: Contract;
  selectOption?(option: Contract): void;
}

export default function ContractDropdownItem(props: Props) {
  const { data, selectOption } = props;

  return (
    <OptionWrapper onClick={() => selectOption && selectOption(data)}>{data.name}</OptionWrapper>
  );
}
