import { FC, useCallback, useContext, useEffect, useState } from 'react';

import styled, { createGlobalStyle } from 'styled-components';

import { LinkApp } from '@components';
import ProtectIconCheck from '@components/icons/ProtectIconCheck';
import { COLORS, FONT_SIZE } from '@theme';
import { translateRaw } from '@translations';
import { ITxReceipt } from '@types';

import { ProtectTxContext } from '../ProtectTxProvider';

interface RelayedToNetworkProps {
  relayedToNetwork: boolean;
}

const Wrapper = styled.div`
  display: flex;
  position: absolute;
  justify-content: flex-start;
  align-items: center;
  width: calc(100% + 4.5rem);
  left: -2.25em;
  padding: 18px 40px;
  background: ${COLORS.PURPLE};
  color: ${COLORS.WHITE};
  top: -1.5rem;
  border-top-left-radius: 0.375em;
  border-top-right-radius: 0.375em;
  p {
    margin: 0 15px 0;
    font-size: ${FONT_SIZE.BASE};
    line-height: ${FONT_SIZE.XL};
  }
`;

// @todo: A hacky way to change the title of content panel
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

interface AbortTransactionProps {
  onTxSent(txReceipt: ITxReceipt): void;
}

export const ProtectTxAbort: FC<AbortTransactionProps> = ({ onTxSent }) => {
  const [isCanceled, setIsCanceled] = useState(false);
  const [protectTxCountdown, setProtectTxCountdown] = useState(20);

  const { invokeProtectTxTimeoutFunction } = useContext(ProtectTxContext);

  useEffect(() => {
    let protectTxTimer: ReturnType<typeof setTimeout> | null = null;
    if (protectTxCountdown > 0) {
      protectTxTimer = setTimeout(() => setProtectTxCountdown((prevCount) => prevCount - 1), 1000);
    } else if (protectTxCountdown === 0) {
      invokeProtectTxTimeoutFunction((txReceipt) => {
        onTxSent(txReceipt);
      });
    }
    return () => {
      if (protectTxTimer) {
        clearTimeout(protectTxTimer);
      }
    };
  }, [protectTxCountdown]);

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
    <Wrapper>
      <ProtectIconCheck fillColor={COLORS.WHITE} />
      {isCanceled && (
        <>
          <p>{translateRaw('PROTECTED_TX_ABORTED_TX')}</p>
          <LinkApp href="#" onClick={onSendClick} ml={'auto'}>
            {translateRaw('PROTECTED_TX_RESEND')}
          </LinkApp>
        </>
      )}
      {!isCanceled && protectTxCountdown > 0 && (
        <>
          <p>
            {translateRaw('PROTECTED_TX_MODIFY_TX', {
              $sec: `0:${protectTxCountdown.toString().padStart(2, '0')}`
            })}
          </p>
          <LinkApp href="#" onClick={onCancelClick} ml={'auto'}>
            {translateRaw('PROTECTED_TX_CANCEL')}
          </LinkApp>
        </>
      )}
      {!isCanceled && protectTxCountdown === 0 && (
        <p>{translateRaw('PROTECTED_TX_RELAYED_TO_NETWORK')}</p>
      )}
      <TransactionReceiptHeaderGlobal relayedToNetwork={!isCanceled && protectTxCountdown === 0} />
    </Wrapper>
  );
};
