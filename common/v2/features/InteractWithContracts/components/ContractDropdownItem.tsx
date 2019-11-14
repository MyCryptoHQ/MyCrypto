import React from 'react';
import styled from 'styled-components';

import { COLORS } from 'v2/theme';
import { Contract } from 'v2/types';

const { SILVER } = COLORS;

interface OptionWrapperProps {
  isSelectable: boolean;
}

const OptionWrapper = styled.div<OptionWrapperProps>`
  padding: 12px 15px;

  ${props =>
    props.isSelectable &&
    ` &:hover {
    background-color: ${SILVER};
  }`};
`;

interface Props {
  option: Contract;
  onSelect?(option: Contract): void;
}

export default function ContractDropdownItem(props: Props) {
  const { option, onSelect } = props;

  return (
    <OptionWrapper
      onClick={() => (onSelect ? onSelect(option) : undefined)}
      isSelectable={!!onSelect}
    >
      {option.name}
    </OptionWrapper>
  );
}
