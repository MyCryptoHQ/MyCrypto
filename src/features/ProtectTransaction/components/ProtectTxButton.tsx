import React, { FC, useCallback } from 'react';
import styled from 'styled-components';

import { BREAK_POINTS, COLORS, FONT_SIZE, LINE_HEIGHT, SPACING } from '@theme';
import { translateRaw } from '@translations';
import { useScreenSize } from '@utils';
import ProtectIcon from '@components/icons/ProtectIcon';
import ProtectIconCheck from '@components/icons/ProtectIconCheck';
import ArrowRightIcon from '@components/icons/ArrowRightIcon';

const TransactionProtectionButtonText = styled.div`
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

const STransactionProtectionButton = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: ${SPACING.BASE} ${SPACING.BASE} 15px;
  margin: 30px 0 15px;
  border: 1px solid ${COLORS.PURPLE};
  box-sizing: border-box;
  border-radius: 2px;
  background: ${COLORS.WHITE};

  &[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }

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

  &:not([disabled]):hover {
    background: ${COLORS.PURPLE};

    h6,
    p {
      color: ${COLORS.WHITE};
    }

    svg {
      path {
        fill: ${COLORS.WHITE} !important;
      }
    }
  }
`;

interface Props {
  disabled?: boolean;
  reviewReport?: boolean;
  onClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
}

export const ProtectTxButton: FC<Props> = ({
  onClick: onTransactionProtectionClick,
  disabled = false,
  reviewReport = false
}) => {
  const { isSmScreen, isMdScreen } = useScreenSize();

  const onClickEvent = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      onTransactionProtectionClick(e);
    },
    [onTransactionProtectionClick]
  );

  if (!isMdScreen && reviewReport) {
    return <></>;
  }

  return (
    <STransactionProtectionButton
      type="button"
      onClick={onClickEvent}
      disabled={disabled || reviewReport}
    >
      {isSmScreen && <ProtectIcon size="md" />}
      {!isSmScreen && <ProtectIconCheck size="sm" />}
      <TransactionProtectionButtonText>
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
      </TransactionProtectionButtonText>
      <ArrowRightIcon />
    </STransactionProtectionButton>
  );
};
