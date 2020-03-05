import React, { FC, useCallback } from 'react';
import styled from 'styled-components';

import ProtectIcon from './icons/ProtectIcon';
import ArrowRightIcon from './icons/ArrowRightIcon';
import { COLORS } from '../../../theme';

const TransactionProtectionButtonText = styled.div`
  max-width: 70%;
  text-align: left;

  h6 {
    font-family: Lato, serif;
    font-size: 16px;
    line-height: 15px;
    margin-top: 0;
    color: #424242;
  }

  p {
    font-family: Lato, serif;
    font-size: 12px;
    line-height: 18px;
    margin-bottom: 0;
  }
`;

const TransactionProtectionButtonStyled = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 16px 40px 14px;
  margin: 30px 0 15px;
  border: 1px solid ${COLORS.PURPLE};
  box-sizing: border-box;
  border-radius: 2px;
  background: ${COLORS.WHITE};

  &[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
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
  disabled: boolean;
  onClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
}

export const TransactionProtectionButton: FC<TransactionProtectionButtonProps> = ({
  onClick: onTransactionProtectionClick,
  disabled
}) => {
  const onClickEvent = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      onTransactionProtectionClick(e);
    },
    [onTransactionProtectionClick]
  );

  return (
    <TransactionProtectionButtonStyled type="button" onClick={onClickEvent} disabled={disabled}>
      <ProtectIcon size="md" />
      <TransactionProtectionButtonText>
        <h6>Get Transaction Protection</h6>
        <p>
          Gain valuable information about the recipient address and the ability to undo your
          transaction within 20 seconds.
        </p>
      </TransactionProtectionButtonText>
      <ArrowRightIcon />
    </TransactionProtectionButtonStyled>
  );
};
