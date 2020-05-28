import React from 'react';
import styled from 'styled-components';

import { Contract } from '@types';
import { ActionTypes, ValueType } from 'react-select';

const OptionWrapper = styled.div`
  padding: 12px 15px;
`;

interface Props {
  data: Contract;
  setValue?(value: ValueType<Contract>, action: ActionTypes): void;
}

export default function ContractDropdownItem(props: Props) {
  const { data, setValue } = props;

  return (
    <OptionWrapper onClick={() => setValue && setValue(data, 'select-option')}>
      {data.name}
    </OptionWrapper>
  );
}
