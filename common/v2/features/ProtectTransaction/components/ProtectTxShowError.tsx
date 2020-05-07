import React, { FC } from 'react';
import styled from 'styled-components';
import { socialMediaLinks, SUPPORT_EMAIL } from 'v2/config';
import { COLORS, FONT_SIZE } from 'v2/theme';
import { Trans } from 'v2/translations';
import { LinkOut } from 'v2/components';
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
              <LinkOut
                showIcon={false}
                inline={true}
                fontSize={FONT_SIZE.SM}
                fontColor={COLORS.PASTEL_RED}
                underline={true}
                link={`mailto:${SUPPORT_EMAIL}?subject=Protected transaction ETH only`}
                text={SUPPORT_EMAIL}
              />
            ),
            $twitter: () => (
              <LinkOut
                showIcon={false}
                inline={true}
                fontSize={FONT_SIZE.SM}
                fontColor={COLORS.PASTEL_RED}
                underline={true}
                link={twitter ? twitter.link : ''}
                text="Twitter"
              />
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
              <LinkOut
                showIcon={false}
                inline={true}
                fontSize={FONT_SIZE.SM}
                fontColor={COLORS.PASTEL_RED}
                underline={true}
                link={`mailto:${SUPPORT_EMAIL}?subject=Protected transaction $5.00 limit`}
                text={SUPPORT_EMAIL}
              />
            ),
            $twitter: () => (
              <LinkOut
                showIcon={false}
                inline={true}
                fontSize={FONT_SIZE.SM}
                fontColor={COLORS.PASTEL_RED}
                underline={true}
                link={twitter ? twitter.link : ''}
                text="Twitter"
              />
            )
          }}
        />
      </ProtectedTransactionErrorWrapper>
    );
  }

  return <></>;
};
