import React from 'react';
import styled from 'styled-components';

import { COLORS } from 'v2/theme';

const { SILVER } = COLORS;
const OptionWrapper = styled.div`
  padding: 12px 15px;

  &:hover {
    background-color: ${SILVER};
  }
`;

export default function ContractDropdownValue(props: { value: { name: string } }) {
  const {
    value: { name }
  } = props;

  return <OptionWrapper>{name}</OptionWrapper>;
}
