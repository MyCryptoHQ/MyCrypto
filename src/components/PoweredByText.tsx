import React from 'react';
import styled from 'styled-components';

import { translateRaw } from '@translations';

import nansenLogo from '@assets/images/credits/credits-nansen.svg';
import enslogo from '@assets/images/ens/ensIcon.svg';
import coinGeckoIcon from '@assets/images/credits/credits-coingecko.png';
import zapperLogo from '@assets/images/defizap/zapperLogo.svg';
import { SPACING } from '@theme';
import { Typography } from '@components';

const Wrapper = styled.div<{ css?: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  ${({ css }) =>
    css &&
    `
      ${css}
    `}
`;

const Logo = styled.img`
  height: 24px;
`;

const Text = styled(Typography)<{ flipped?: boolean }>`
  ${({ flipped }) =>
    flipped &&
    `
margin-left: ${SPACING.XS};
`}
  ${({ flipped }) =>
    !flipped &&
    `
margin-right: ${SPACING.XS};
`}
`;

interface PoweredByProvider {
  icon: any;
  text: string;
  flipped?: boolean;
  fontSize?: string;
  css?: string;
}

export enum PoweredByProviders {
  NANSEN = 'NANSEN',
  ENS = 'ENS',
  COINGECKO = 'COINGECKO',
  ZAPPER = 'ZAPPER'
}

const providers: Record<string, PoweredByProvider> = {
  NANSEN: {
    icon: nansenLogo,
    text: translateRaw('POWERED_BY'),
    fontSize: '12px',
    css: `
      position: absolute;
      bottom: ${SPACING.BASE};
    `
  },
  ENS: { icon: enslogo, text: translateRaw('ENS_LOGO_TEXT'), flipped: true },
  COINGECKO: {
    icon: coinGeckoIcon,
    text: translateRaw('POWERED_BY'),
    fontSize: '10px',
    css: `
      > span {
      color: #b5bfc8;
      }
      > img {
        height: 25px;
      }
      `
  },
  ZAPPER: {
    icon: zapperLogo,
    text: translateRaw('ZAP_POWERED_BY'),
    flipped: true
  }
};

const PoweredByText = ({ provider }: { provider: PoweredByProviders }) => {
  const { text, icon, flipped, fontSize, css } = providers[provider];
  return (
    <Wrapper css={css}>
      {flipped && <Logo src={icon} />}
      <Text flipped={flipped} fontSize={fontSize}>
        {text}
      </Text>
      {!flipped && <Logo src={icon} />}
    </Wrapper>
  );
};
export default PoweredByText;
