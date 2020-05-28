import React from 'react';
import styled from 'styled-components';
import { ActionTypes, ValueType } from 'react-select';

import { COLORS } from '@theme';
import { translateRaw } from '@translations';

import { ABIItem } from '../types';
import { isReadOperation } from '../helpers';

interface OptionWrapperProps {
  isSelectable: boolean;
}

const OptionWrapper = styled.div<OptionWrapperProps>`
  display: flex;
  justify-content: space-between;
  padding: 12px 15px;
  font-weight: ${(props) => (props.isSelectable ? 'default' : 'bold')};
`;

interface StickerProps {
  isRead: boolean;
}

const Sticker = styled.div<StickerProps>`
  background-color: ${(props) => (props.isRead ? COLORS.SUCCESS_GREEN : COLORS.BLUE_BRIGHT)};
  border-radius: 28px;
  color: ${COLORS.WHITE};
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
  value: ABIItem;
  setValue?(value: ValueType<ABIItem>, action: ActionTypes): void;
}

export default function FunctionDropdownItem(props: Props) {
  const { value, setValue } = props;

  const isRead = isReadOperation(value);
  return (
    <OptionWrapper
      onClick={() => setValue && setValue(value, 'select-option')}
      isSelectable={!!setValue}
    >
      {value.name}
      <Sticker isRead={isRead}>
        {isRead ? translateRaw('READ').toUpperCase() : translateRaw('WRITE').toUpperCase()}
      </Sticker>
    </OptionWrapper>
  );
}
