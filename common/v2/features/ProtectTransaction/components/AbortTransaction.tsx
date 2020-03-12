import React, { FC, useCallback, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { COLORS } from 'v2/theme';
import { translateRaw } from 'v2/translations';
import ProtectIconCheck from './icons/ProtectIconCheck';

interface RelayedToNetworkProps {
  relayedToNetwork: boolean;
}

// TODO: A hacky way to change the title of content panel
const TransactionReceiptHeaderGlobal = createGlobalStyle<RelayedToNetworkProps>`
  [class^="ContentPanel__ContentPanelWrapper"] {
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

    &.has-side-panel {
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

const AbortTransactionWrapper = styled.div<RelayedToNetworkProps>`
  display: flex;
  position: absolute;
  justify-content: flex-start;
  align-items: center;
  width: calc(100% + 4.5rem);
  left: -2.25em;
  padding: 18px 40px;
  background: ${COLORS.PURPLE};
  color: ${COLORS.WHITE};

  ${({ relayedToNetwork }) =>
    relayedToNetwork
      ? `top: calc(-0.5rem - 75px - 60px - 44px - 44px);`
      : `top: calc(-0.5rem - 75px - 60px - 44px);`};

  ${({ relayedToNetwork }) =>
    relayedToNetwork
      ? `
    @media (min-width: 394px) {
      top: calc(-0.5rem - 75px - 60px - 44px);
    }
    @media (min-width: 556px) {
      top: calc(-0.5rem - 75px - 60px);
    }
    `
      : `
    @media (min-width: 462px) {
      top: calc(-0.5rem - 75px - 60px);
    }
    `};

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
    <AbortTransactionWrapper relayedToNetwork={!isCanceled && countdown === 0}>
      <ProtectIconCheck fillColor={COLORS.WHITE} />
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
