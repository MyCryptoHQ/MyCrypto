import React, { FC, useCallback, useState } from 'react';
import styled from 'styled-components';
import ProtectIcon from './icons/ProtectIcon';

const AbortTransactionWrapper = styled.div`
  display: flex;
  position: absolute;
  justify-content: flex-start;
  align-items: center;
  width: calc(100% + 4.5rem);
  top: calc(-0.5rem - 75px);
  left: -2.25em;
  padding: 18px 40px;
  background: #a086f7;
  color: white;

  p {
    margin: 0 15px 0;
    font-size: 16px;
    line-height: 24px;
  }
`;

const AbortTransactionLink = styled.a`
  margin-left: auto;
  text-decoration: underline;
  color: white;

  &:hover {
    color: black;
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
    </AbortTransactionWrapper>
  );
};
