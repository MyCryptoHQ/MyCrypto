import React, { FC, useCallback, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { COLORS, FONT_SIZE } from 'v2/theme';
import { translateRaw } from 'v2/translations';
import ProtectIconCheck from './icons/ProtectIconCheck';
import { Link } from 'v2/components';

interface RelayedToNetworkProps {
  relayedToNetwork: boolean;
}

const Wrapper = styled.div<RelayedToNetworkProps>`
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
    font-size: ${FONT_SIZE.BASE};
    line-height: ${FONT_SIZE.XL};
  }
`;

// TODO: A hacky way to change the title of content panel
const TransactionReceiptHeaderGlobal = createGlobalStyle<RelayedToNetworkProps>`
  .send-assets-stepper {
    > section {
      > p {
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

const AbortTransactionLink = styled(Link)`
  margin-left: auto;
`;

interface AbortTransactionProps {
  countdown: number;

  onAbortTransaction(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void;
  onSendTransaction(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void;
}

export const AbortTransaction: FC<AbortTransactionProps> = ({
  countdown,
  onAbortTransaction,
  onSendTransaction
}) => {
  const [isCanceled, setIsCanceled] = useState(false);

  const onCancelClick = useCallback(
    e => {
      setIsCanceled(true);
      onAbortTransaction(e);
    },
    [onAbortTransaction, setIsCanceled]
  );

  const onSendClick = useCallback(
    e => {
      setIsCanceled(false);
      onSendTransaction(e);
    },
    [onSendTransaction, setIsCanceled]
  );

  return (
    <Wrapper relayedToNetwork={!isCanceled && countdown === 0}>
      <ProtectIconCheck fillColor={COLORS.WHITE} />
      {isCanceled && (
        <>
          <p>{translateRaw('PROTECTED_TX_ABORTED_TX')}</p>
          <AbortTransactionLink type="white-black" underline={true} onClick={onSendClick}>
            {translateRaw('PROTECTED_TX_RESEND')}
          </AbortTransactionLink>
        </>
      )}
      {!isCanceled && countdown > 0 && (
        <>
          <p>
            {translateRaw('PROTECTED_TX_MODIFY_TX', {
              $sec: `0:${countdown.toString().padStart(2, '0')}`
            })}
          </p>
          <AbortTransactionLink type="white-black" underline={true} onClick={onCancelClick}>
            {translateRaw('PROTECTED_TX_CANCEL')}
          </AbortTransactionLink>
        </>
      )}
      {!isCanceled && countdown === 0 && <p>{translateRaw('PROTECTED_TX_RELAYED_TO_NETWORK')}</p>}
      <TransactionReceiptHeaderGlobal relayedToNetwork={!isCanceled && countdown === 0} />
    </Wrapper>
  );
};
