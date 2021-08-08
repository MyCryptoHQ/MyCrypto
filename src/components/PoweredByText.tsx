import styled from 'styled-components';

import { Typography } from '@components';
import { COLORS, FONT_SIZE, SPACING } from '@theme';
import translate, { translateRaw } from '@translations';

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

const Text = styled(Typography)<{ flipped?: boolean; icon?: string }>`
  ${({ flipped, icon }) =>
    flipped &&
    icon &&
    `
margin-left: ${SPACING.XS};
`}
  ${({ flipped, icon }) =>
    !flipped &&
    icon &&
    `
margin-right: ${SPACING.XS};
`}
`;

interface PoweredByProvider {
  icon?: string;
  text: string | JSX.Element;
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
  },
  FINDETH: {
    css: `
    && {
      justify-content: left;

    }
    > span {
      color: ${COLORS.BLUE_GREY}
    }`,
    text: translate('POWERED_BY_FINDETH')
  },
  ZEROX: {
    icon: 'zeroxLogo',
    text: translateRaw('POWERED_BY')
  },
  OPENSEA: {
    text: 'Powered by OpenSea'
  }
};

export type PoweredByProviders = keyof typeof providers;

const PoweredByText = ({ provider }: { provider: PoweredByProviders }) => {
  const { text, icon, flipped, fontSize, css } = providers[provider];
  return (
    <Wrapper css={css}>
      {flipped && icon && <Logo type={icon} />}
      <Text icon={icon} flipped={flipped} fontSize={fontSize}>
        {text}
      </Text>
      {!flipped && icon && <Logo type={icon} />}
    </Wrapper>
  );
};
export default PoweredByText;
