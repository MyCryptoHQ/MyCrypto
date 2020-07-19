import React from 'react';
import styled from 'styled-components';

import { translateRaw } from '@translations';

import { SPACING, FONT_SIZE } from '@theme';
import { Typography } from '@components';
import Icon from './Icon';

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

const Logo = styled(Icon)`
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
  icon: string;
  text: string;
  flipped?: boolean;
  fontSize?: string;
  css?: string;
}

const providers: Record<string, PoweredByProvider> = {
  NANSEN: {
    icon: 'nansenLogo',
    text: translateRaw('POWERED_BY'),
    fontSize: `${FONT_SIZE.XS}`
  },
  ENS: { icon: 'ensLogo', text: translateRaw('ENS_LOGO_TEXT'), flipped: true },
  COINGECKO: {
    icon: 'coinGeckoLogo',
    text: translateRaw('POWERED_BY'),
    fontSize: '10px',
    css: `
      > span {
      color: #b5bfc8;
      }
      > svg {
        height: 25px;
        width: 80px;
      }
      `
  },
  ZAPPER: {
    icon: 'zapperLogo',
    text: translateRaw('ZAP_POWERED_BY'),
    flipped: true
  }
};

export type PoweredByProviders = keyof typeof providers;

const PoweredByText = ({ provider }: { provider: PoweredByProviders }) => {
  const { text, icon, flipped, fontSize, css } = providers[provider];
  return (
    <Wrapper css={css}>
      {flipped && <Logo type={icon} />}
      <Text flipped={flipped} fontSize={fontSize}>
        {text}
      </Text>
      {!flipped && <Logo type={icon} />}
    </Wrapper>
  );
};
export default PoweredByText;
