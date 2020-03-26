import React, { FC } from 'react';
import styled from 'styled-components';
import { socialMediaLinks, SUPPORT_EMAIL } from 'v2/config';
import { COLORS, FONT_SIZE } from 'v2/theme';
import { Trans } from 'v2/translations';
import { ProtectTxError } from '../types';

const ProtectedTransactionErrorWrapper = styled.div`
  text-align: left;
  margin-top: 15px;
  width: 100%;
  font-size: ${FONT_SIZE.SM};
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

export const ProtectTxShowError: FC<ProtectedTransactionErrorProps> = ({
  shown,
  protectTxError
}) => {
  if (!shown) return <></>;

  const twitter = socialMediaLinks.find(s => s.text.toLowerCase() === 'twitter');

  if (protectTxError === ProtectTxError.ETH_ONLY) {
    return (
      <ProtectedTransactionErrorWrapper>
        <Trans
          id="PROTECTED_TX_ERROR_ETH_ONLY"
          variables={{
            $supportEmail: () => (
              <a
                href={`mailto:${SUPPORT_EMAIL}?subject=Protected transaction ETH only`}
                rel="noopener noreferrer"
                target="_blank"
              >
                {SUPPORT_EMAIL}
              </a>
            ),
            $twitter: () => (
              <a href={twitter ? twitter.link : ''} rel="noopener noreferrer" target="_blank">
                Twitter
              </a>
            )
          }}
        />
      </ProtectedTransactionErrorWrapper>
    );
  } else if (protectTxError === ProtectTxError.LESS_THAN_MIN_AMOUNT) {
    return (
      <ProtectedTransactionErrorWrapper>
        <Trans
          id="PROTECTED_TX_ERROR_LESS_THAN_MIN_AMOUNT"
          variables={{
            $supportEmail: () => (
              <a
                href={`mailto:${SUPPORT_EMAIL}?subject=Protected transaction $5.00 limit`}
                rel="noopener noreferrer"
                target="_blank"
              >
                {SUPPORT_EMAIL}
              </a>
            ),
            $twitter: () => (
              <a href={twitter ? twitter.link : ''} rel="noopener noreferrer" target="_blank">
                Twitter
              </a>
            )
          }}
        />
      </ProtectedTransactionErrorWrapper>
    );
  }

  return <></>;
};
