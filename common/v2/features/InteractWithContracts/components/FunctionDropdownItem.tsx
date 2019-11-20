import React from 'react';
import styled from 'styled-components';

import { COLORS } from 'v2/theme';
import { ABIItem } from '../types';
import { isReadOperation } from '../helpers';

const { SILVER, SUCCESS_GREEN, WHITE, BRIGHT_SKY_BLUE } = COLORS;

interface OptionWrapperProps {
  isSelectable: boolean;
}

const OptionWrapper = styled.div<OptionWrapperProps>`
  display: flex;
  justify-content: space-between;
  padding: 12px 15px;
  font-weight: ${props => (props.isSelectable ? 'default' : 'bold')};

  ${props =>
    props.isSelectable &&
    ` &:hover {
    background-color: ${SILVER};
  }`};
`;

interface StickerProps {
  isRead: boolean;
}

const Sticker = styled.div<StickerProps>`
  background-color: ${props => (props.isRead ? SUCCESS_GREEN : BRIGHT_SKY_BLUE)};
  border-radius: 28px;
  color: ${WHITE};
  padding: 2px 8px;
  font-size: 0.7em;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 60px;
  opacity: 0.95;
`;

interface Props {
  option: ABIItem;
  onSelect?(option: ABIItem): void;
}

export default function FunctionDropdownItem(props: Props) {
  const { option, onSelect } = props;

  const isRead = isReadOperation(option);
  return (
    <OptionWrapper
      onClick={() => (onSelect ? onSelect(option) : undefined)}
      isSelectable={!!onSelect}
    >
      {option.name}
      <Sticker isRead={isRead}>{isRead ? 'READ' : 'WRITE'}</Sticker>
    </OptionWrapper>
  );
}
