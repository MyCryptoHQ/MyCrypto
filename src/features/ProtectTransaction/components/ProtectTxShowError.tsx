import { FC } from 'react';

import styled from 'styled-components';

import { LinkApp } from '@components';
import { socialMediaLinks, SUPPORT_EMAIL } from '@config';
import { COLORS, FONT_SIZE } from '@theme';
import { Trans } from '@translations';

import { ProtectTxError } from '../types';

const ProtectedTransactionErrorWrapper = styled.div`
  text-align: left;
  margin-top: 15px;
  width: 100%;
  font-size: ${FONT_SIZE.SM};
  line-height: 21px;
  color: ${COLORS.PASTEL_RED};
`;

interface Props {
  shown: boolean;
  protectTxError: ProtectTxError;
}

export const ProtectTxShowError: FC<Props> = ({ shown, protectTxError }) => {
  if (!shown) return <></>;

  const twitter = socialMediaLinks.find((s) => s.text.toLowerCase() === 'twitter');

  if (protectTxError === ProtectTxError.ETH_ONLY) {
    return (
      <ProtectedTransactionErrorWrapper>
        <Trans
          id="PROTECTED_TX_ERROR_ETH_ONLY"
          variables={{
            $supportEmail: () => (
              <LinkApp
                color={'PASTEL_RED'}
                $underline={true}
                isExternal={true}
                href={`mailto:${SUPPORT_EMAIL}?subject=Protected transaction ETH only`}
              >
                {SUPPORT_EMAIL}
              </LinkApp>
            ),
            $twitter: () => (
              <LinkApp
                color={'PASTEL_RED'}
                $underline={true}
                isExternal={true}
                href={twitter!.link}
              >
                {'Twitter'}
              </LinkApp>
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
              <LinkApp
                color={'PASTEL_RED'}
                $underline={true}
                isExternal={true}
                href={`mailto:${SUPPORT_EMAIL}?subject=Protected transaction $5.00 limit`}
              >
                {SUPPORT_EMAIL}
              </LinkApp>
            ),
            $twitter: () => (
              <LinkApp
                color={'PASTEL_RED'}
                $underline={true}
                isExternal={true}
                href={twitter!.link}
              >
                {'Twitter'}
              </LinkApp>
            )
          }}
        />
      </ProtectedTransactionErrorWrapper>
    );
  }

  return <></>;
};
