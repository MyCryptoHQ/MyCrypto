import { FC, MouseEvent, useCallback } from 'react';

import styled, { css } from 'styled-components';

import Icon from '@components/Icon';
import ProtectIcon from '@components/icons/ProtectIcon';
import ProtectIconCheck from '@components/icons/ProtectIconCheck';
import { BREAK_POINTS, COLORS, FONT_SIZE, LINE_HEIGHT, SPACING } from '@theme';
import { translateRaw } from '@translations';
import { useScreenSize } from '@utils';

const TextWrapper = styled.div`
  max-width: 85%;
  text-align: left;

  h6 {
    font-size: ${FONT_SIZE.BASE};
    line-height: 15px;
    margin-top: 0;
    color: #424242;
  }

  p {
    font-size: ${FONT_SIZE.XS};
    line-height: ${LINE_HEIGHT.MD};
    margin-bottom: 0;
  }

  @media (min-width: ${BREAK_POINTS.SCREEN_SM}) {
    max-width: 70%;
  }
`;

const SButton = styled.div<{ disabled: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 30px 0 15px;
  border: 1px solid ${COLORS.PURPLE};
  box-sizing: border-box;
  border-radius: 2px;
  background: ${COLORS.WHITE};

  ${(p) =>
    p.disabled &&
    css`
      opacity: 0.5;
      cursor: not-allowed;
    `}
`;

const ButtonWrapper = styled.div<{ opened: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  width: 100%;
  svg:nth-child(1) {
    display: flex;
    align-self: flex-start;
  }

  @media (min-width: ${BREAK_POINTS.SCREEN_SM}) {
    padding: 16px 40px 14px;

    svg:nth-child(1) {
      display: flex;
      align-self: center;
    }
  }
  @media (max-width: ${BREAK_POINTS.SCREEN_MD}) {
    padding: ${SPACING.BASE};
    border-bottom: 2px solid ${(p) => (p.opened ? COLORS.GREY_LIGHTER : 'transparent')};
  }
`;

const SIcon = styled(Icon)<{ $expanded: boolean }>`
  @media (max-width: ${BREAK_POINTS.SCREEN_MD}) {
    transform: rotate(${(p) => (p.$expanded ? '-90deg' : '90deg')});
  }
  transform: rotate(${(p) => (p.$expanded ? '180deg' : '0')});
  transition: all 0.3s;
`;

interface Props {
  disabled?: boolean;
  reviewReport?: boolean;
  protectTxShow: boolean;
  onClick(e: MouseEvent<HTMLButtonElement, MouseEvent>): void;
  stepper(): JSX.Element;
}

export const ProtectTxButton: FC<Props> = ({
  onClick: onTransactionProtectionClick,
  disabled = false,
  reviewReport = false,
  protectTxShow,
  stepper
}) => {
  const { isSmScreen, isMdScreen } = useScreenSize();

  const onClickEvent = useCallback(
    (e) => {
      onTransactionProtectionClick(e);
    },
    [onTransactionProtectionClick]
  );

  const isDisabled = (() => {
    if (!isMdScreen && reviewReport) {
      return false;
    } else if (isMdScreen && reviewReport) {
      return true;
    }
    return disabled;
  })();

  return (
    <SButton disabled={isDisabled}>
      <ButtonWrapper opened={protectTxShow} onClick={onClickEvent}>
        {isSmScreen && <ProtectIcon size="md" />}
        {!isSmScreen && <ProtectIconCheck size="sm" />}
        <TextWrapper>
          {reviewReport && (
            <>
              <h6>{translateRaw('PROTECTED_TX_THIS_TX_IS_PROTECTED')}</h6>
              <p>{translateRaw('PROTECTED_TX_THIS_TX_IS_PROTECTED_DESC')}</p>
            </>
          )}
          {!reviewReport && (
            <>
              <h6>{translateRaw('PROTECTED_TX_GET_TX_PROTECTION')}</h6>
              <p>{translateRaw('PROTECTED_TX_GET_TX_PROTECTION_DESC')}</p>
            </>
          )}
        </TextWrapper>
        <SIcon type="caret" color={COLORS.PURPLE} height="11px" $expanded={protectTxShow} />
      </ButtonWrapper>
      {!isMdScreen && protectTxShow && stepper()}
    </SButton>
  );
};
