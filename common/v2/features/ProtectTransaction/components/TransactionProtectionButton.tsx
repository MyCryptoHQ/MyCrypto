import React, { FC, useCallback } from 'react';
import styled from 'styled-components';

import { BREAK_POINTS, COLORS } from 'v2/theme';
import useMediaQuery from 'v2/vendor/react-use/useMediaQuery';

import ProtectIcon from './icons/ProtectIcon';
import ProtectIconCheck from './icons/ProtectIconCheck';
import ArrowRightIcon from './icons/ArrowRightIcon';

const TransactionProtectionButtonText = styled.div`
  max-width: 85%;
  text-align: left;

  h6 {
    font-size: 16px;
    line-height: 15px;
    margin-top: 0;
    color: #424242;
  }

  p {
    font-size: 12px;
    line-height: 18px;
    margin-bottom: 0;
  }

  @media (min-width: ${BREAK_POINTS.SCREEN_SM}) {
    max-width: 70%;
  }
`;

const TransactionProtectionButtonStyled = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 20px 20px 15px;
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

interface TransactionProtectionButtonProps {
  disabled?: boolean;
  reviewReport?: boolean;
  onClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
}

export const TransactionProtectionButton: FC<TransactionProtectionButtonProps> = ({
  onClick: onTransactionProtectionClick,
  disabled = false,
  reviewReport = false
}) => {
  const isSmScreen = useMediaQuery(`(min-width: ${BREAK_POINTS.SCREEN_SM})`);

  const onClickEvent = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      onTransactionProtectionClick(e);
    },
    [onTransactionProtectionClick]
  );

  if (isSmScreen && reviewReport) {
    return <></>;
  }

  return (
    <TransactionProtectionButtonStyled type="button" onClick={onClickEvent} disabled={disabled}>
      {isSmScreen && <ProtectIcon size="md" />}
      {!isSmScreen && <ProtectIconCheck size="sm" />}
      <TransactionProtectionButtonText>
        {reviewReport && (
          <>
            <h6>This Transaction is Protected!</h6>
            <p>
              Review the report for the recipient address to verfiy that it is safe before sending
              your funds.
            </p>
          </>
        )}
        {!reviewReport && (
          <>
            <h6>Get Transaction Protection</h6>
            <p>
              Gain valuable information about the recipient address and the ability to undo your
              transaction within 20 seconds.
            </p>
          </>
        )}
      </TransactionProtectionButtonText>
      <ArrowRightIcon />
    </TransactionProtectionButtonStyled>
  );
};
