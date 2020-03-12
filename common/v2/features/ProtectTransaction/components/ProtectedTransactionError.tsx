import React, { FC } from 'react';
import styled from 'styled-components';
import { SUPPORT_EMAIL, TWITTER_URL } from 'v2/config';
import { COLORS } from 'v2/theme';
import { translateRaw } from 'v2/translations';
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
        {(t => {
          const tSplit = t.split(/\$supportEmail|\$twitter/);
          if (tSplit.length === 3) {
            return (
              <>
                {tSplit[0]}
                <a
                  href={`mailto:${SUPPORT_EMAIL}?subject=Protected transaction ETH only`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {SUPPORT_EMAIL}
                </a>
                {tSplit[1]}
                <a href={TWITTER_URL} rel="noopener noreferrer" target="_blank">
                  Twitter
                </a>
                {tSplit[2]}
              </>
            );
          }
          return t;
        })(translateRaw('PROTECTED_TX_ERROR_ETH_ONLY'))}
      </ProtectedTransactionErrorWrapper>
    );
  } else if (protectTxError === ProtectTxError.LESS_THAN_MIN_AMOUNT) {
    return (
      <ProtectedTransactionErrorWrapper>
        {(t => {
          const tSplit = t.split(/\$supportEmail|\$twitter/);
          if (tSplit.length === 3) {
            return (
              <>
                {tSplit[0]}
                <a
                  href={`mailto:${SUPPORT_EMAIL}?subject=Protected transaction $5.00 limit`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {SUPPORT_EMAIL}
                </a>
                {tSplit[1]}
                <a href={TWITTER_URL} rel="noopener noreferrer" target="_blank">
                  Twitter
                </a>
                {tSplit[2]}
              </>
            );
          }
          return t;
        })(translateRaw('PROTECTED_TX_ERROR_LESS_THAN_MIN_AMOUNT'))}
      </ProtectedTransactionErrorWrapper>
    );
  }

  return <></>;
};
