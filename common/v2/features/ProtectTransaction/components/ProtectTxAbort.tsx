import React, { FC, useCallback, useContext, useEffect, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { COLORS, FONT_SIZE } from 'v2/theme';
import { translateRaw } from 'v2/translations';
import { ProtectIconCheck } from 'v2/components/icons';
import { Link } from 'v2/components';
import { ITxReceipt } from '../../../types';
import { ProtectTxContext } from '../ProtectTxProvider';
import { ProtectTxUtils } from '../utils';

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
  onTxSent(txReceipt: ITxReceipt): void;
}

export const ProtectTxAbort: FC<AbortTransactionProps> = ({ onTxSent }) => {
  const [isCanceled, setIsCanceled] = useState(false);
  const [protectTxCountdown, setProtectTxCountdown] = React.useState(20);

  const protectTxContext = useContext(ProtectTxContext);
  const getProTxValue = ProtectTxUtils.isProtectTxDefined(protectTxContext);
  if (!getProTxValue()) {
    throw new Error('ProtectTxProtection requires to be wrapped in ProtectTxAbort!');
  }

  const { invokeProtectTxTimeoutFunction } = protectTxContext;

  useEffect(() => {
    let protectTxTimer: ReturnType<typeof setTimeout> | null = null;
    if (protectTxCountdown > 0) {
      protectTxTimer = setTimeout(() => setProtectTxCountdown((prevCount) => prevCount - 1), 1000);
    } else if (protectTxCountdown === 0) {
      invokeProtectTxTimeoutFunction((txReceiptCb: (txReceipt: ITxReceipt) => void) => {
        onTxSent(txReceiptCb);
      });
    }
    return () => {
      if (protectTxTimer) {
        clearTimeout(protectTxTimer);
      }
    };
  }, [protectTxContext, protectTxCountdown]);

  const onCancelClick = useCallback(
    (e) => {
      e.preventDefault();

      setIsCanceled(true);
      setProtectTxCountdown(-1);
    },
    [setIsCanceled]
  );

  const onSendClick = useCallback(
    (e) => {
      e.preventDefault();

      setIsCanceled(false);
      setProtectTxCountdown(20);
    },
    [setIsCanceled]
  );

  return (
    <Wrapper relayedToNetwork={!isCanceled && protectTxCountdown === 0}>
      <ProtectIconCheck fillColor={COLORS.WHITE} />
      {isCanceled && (
        <>
          <p>{translateRaw('PROTECTED_TX_ABORTED_TX')}</p>
          <AbortTransactionLink type="white-black" underline={true} onClick={onSendClick}>
            {translateRaw('PROTECTED_TX_RESEND')}
          </AbortTransactionLink>
        </>
      )}
      {!isCanceled && protectTxCountdown > 0 && (
        <>
          <p>
            {translateRaw('PROTECTED_TX_MODIFY_TX', {
              $sec: `0:${protectTxCountdown.toString().padStart(2, '0')}`
            })}
          </p>
          <AbortTransactionLink type="white-black" underline={true} onClick={onCancelClick}>
            {translateRaw('PROTECTED_TX_CANCEL')}
          </AbortTransactionLink>
        </>
      )}
      {!isCanceled && protectTxCountdown === 0 && (
        <p>{translateRaw('PROTECTED_TX_RELAYED_TO_NETWORK')}</p>
      )}
      <TransactionReceiptHeaderGlobal relayedToNetwork={!isCanceled && protectTxCountdown === 0} />
    </Wrapper>
  );
};
