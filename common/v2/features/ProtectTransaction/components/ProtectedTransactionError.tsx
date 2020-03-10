import React, { FC } from 'react';
import styled from 'styled-components';
import { COLORS } from '../../../theme';
import { ProtectTxError } from '../types';

const ProtectedTransactionErrorWrapper = styled.div`
  text-align: left;
  margin-top: 15px;
  width: 100%;
  font-size: 14px;
  line-height: 21px;
  color: ${COLORS.PASTEL_RED};

  > a {
    text-decoration: underline;
    color: ${COLORS.PASTEL_RED};

    &:hover {
      color: ${COLORS.BLACK};
    }
  }
`;

interface ProtectedTransactionErrorProps {
  shown: boolean;
  protectTxError: ProtectTxError;
}

export const ProtectedTransactionError: FC<ProtectedTransactionErrorProps> = ({
  shown,
  protectTxError
}) => {
  if (!shown) return <></>;

  if (protectTxError === ProtectTxError.ETH_ONLY) {
    return (
      <ProtectedTransactionErrorWrapper>
        We currently only allow transaction protection when you are sending <b>ETH</b>. Please ping
        us at&nbsp;
        <a
          href="mailto:support@mycrypto.com?subject=Protected transaction ETH only"
          rel="noopener noreferrer"
          target="_blank"
        >
          support@mycrypto.com
        </a>
        &nbsp; or on &nbsp;
        <a href="https://twitter.com/MyCrypto" rel="noopener noreferrer" target="_blank">
          Twitter
        </a>
        &nbsp; if you disagree with this choice. We may adjust in the future.
      </ProtectedTransactionErrorWrapper>
    );
  } else if (protectTxError === ProtectTxError.LESS_THAN_MIN_AMOUNT) {
    return (
      <ProtectedTransactionErrorWrapper>
        We currently only allow transaction protection when you are sending more than $5.00. Please
        ping us at&nbsp;
        <a
          href="mailto:support@mycrypto.com?subject=Protected transaction 5.00$ limit"
          rel="noopener noreferrer"
          target="_blank"
        >
          support@mycrypto.com
        </a>
        &nbsp; or on&nbsp;
        <a href="https://twitter.com/MyCrypto" rel="noopener noreferrer" target="_blank">
          Twitter
        </a>
        &nbsp; if you disagree with this choice. We may adjust in the future.
      </ProtectedTransactionErrorWrapper>
    );
  }

  return <></>;
};
