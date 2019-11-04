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

interface Props {
  option: any;
  onSelect: any;
}

export default function ContractDropdownOption(props: Props) {
  const { option, onSelect } = props;

  return <OptionWrapper onClick={() => onSelect(option, null)}>{option.name}</OptionWrapper>;
}
