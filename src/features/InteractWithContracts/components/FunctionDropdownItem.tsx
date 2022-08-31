import styled from 'styled-components';

import { COLORS } from '@theme';
import { translateRaw } from '@translations';

import { isReadOperation } from '../helpers';
import { ABIItem } from '../types';

interface OptionWrapperProps {
  isSelectable: boolean;
  paddingLeft?: string;
}

const OptionWrapper = styled.div<OptionWrapperProps>`
  display: flex;
  justify-content: space-between;
  padding: 12px 15px 12px 0px;
  ${({ isSelectable, paddingLeft = '0' }) => `
    font-weight: ${isSelectable ? 'default' : 'bold'};
    padding-left: ${paddingLeft};
  `}
`;

interface StickerProps {
  isRead: boolean;
}

const Sticker = styled.div<StickerProps>`
  background-color: ${(props) => (props.isRead ? COLORS.SUCCESS_GREEN : COLORS.BLUE_BRIGHT)};
  border-radius: 28px;
  color: ${COLORS.WHITE};
  padding: 2px 8px 2px 8px;
  font-size: 0.7em;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  opacity: 0.95;
`;

interface Props {
  option: ABIItem;
  paddingLeft?: string;
  onSelect?(option: ABIItem): void;
}

export default function FunctionDropdownItem(props: Props) {
  const { option, onSelect } = props;

  const isRead = isReadOperation(option);
  return (
    <OptionWrapper
      paddingLeft={props.paddingLeft}
      onClick={() => (onSelect ? onSelect(option) : undefined)}
      isSelectable={!!onSelect}
    >
      {option.name}
      <Sticker isRead={isRead}>
        {isRead ? translateRaw('READ').toUpperCase() : translateRaw('WRITE').toUpperCase()}
      </Sticker>
    </OptionWrapper>
  );
}
