import React, { FC, useCallback, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { translateRaw } from '../../../translations';
import { COLORS } from '../../../theme';
import ProtectIcon from './icons/ProtectIcon';

// TODO: A hacky way to change the title of content panel
const TransactionReceiptHeaderGlobal = createGlobalStyle<{ relayedToNetwork: boolean }>`
  [class^="ContentPanel__ContentPanelWrapper"] {
    &.has-side-panel {
      [class^="ContentPanel__ContentPanelHeading"] {
        margin-top: 60px;

        ${({ relayedToNetwork }) =>
          relayedToNetwork
            ? `
          &::before {
            content: "${translateRaw('TRANSACTION_RELAYED')}";
          }
        `
            : `
          &::before {
            content: "${translateRaw('TRANSACTION_BROADCASTED')}";
          }
        `}
      }

      > section {
        > p ~ div {
          & > div:last-child {
            margin-top: calc(-0.5rem - 75px - 60px);
          }
        }
      }
    }
  }
`;

const AbortTransactionWrapper = styled.div`
  display: flex;
  position: absolute;
  justify-content: flex-start;
  align-items: center;
  width: calc(100% + 4.5rem);
  top: calc(-0.5rem - 75px - 60px);
  left: -2.25em;
  padding: 18px 40px;
  background: ${COLORS.PURPLE};
  color: ${COLORS.WHITE};

  p {
    margin: 0 15px 0;
    font-size: 16px;
    line-height: 24px;
  }
`;

const AbortTransactionLink = styled.a`
  margin-left: auto;
  text-decoration: underline;
  color: ${COLORS.WHITE};

  &:hover {
    color: ${COLORS.BLACK};
  }
`;

interface AbortTransactionProps {
  countdown: number;

  onAbortTransactionClick(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void;
  onSendTransactionClick(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void;
}

export const AbortTransaction: FC<AbortTransactionProps> = ({
  countdown,
  onAbortTransactionClick,
  onSendTransactionClick
}) => {
  const [isCanceled, setIsCanceled] = useState(false);

  const onCancelClick = useCallback(
    e => {
      setIsCanceled(true);
      onAbortTransactionClick(e);
    },
    [onAbortTransactionClick, setIsCanceled]
  );

  const onSendClick = useCallback(
    e => {
      setIsCanceled(false);
      onSendTransactionClick(e);
    },
    [onSendTransactionClick, setIsCanceled]
  );

  return (
    <AbortTransactionWrapper>
      <ProtectIcon fillColor="#fff" />
      {isCanceled && (
        <>
          <p>Transaction has been aborted</p>
          <AbortTransactionLink onClick={onSendClick}>Resend</AbortTransactionLink>
        </>
      )}
      {!isCanceled && countdown > 0 && (
        <>
          <p>
            You can undo or modify this transaction for the next 0:
            {countdown.toString().padStart(2, '0')} sec
          </p>
          <AbortTransactionLink onClick={onCancelClick}>Cancel</AbortTransactionLink>
        </>
      )}
      {!isCanceled && countdown === 0 && <p>Transaction has been relayed to the network!</p>}
      <TransactionReceiptHeaderGlobal relayedToNetwork={!isCanceled && countdown === 0} />
    </AbortTransactionWrapper>
  );
};
