import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import InlineSVG, { IProps as InlineSVGProps } from 'react-inlinesvg';

import back from '@assets/icons/actions/back.svg';
import expand from '@assets/icons/actions/expand.svg';

import logoMyCrypto from '@assets/icons/brand/logo.svg';
import logoMyCryptoText from '@assets/icons/brand/logo-text.svg';

import coinmarketcap from '@assets/icons/social/coinmarketcap.svg';
import facebook from '@assets/icons/social/facebook.svg';
import github from '@assets/icons/social/github.svg';
import reddit from '@assets/icons/social/reddit.svg';
import slack from '@assets/icons/social/slack.svg';
import telegram from '@assets/icons/social/telegram.svg';
import twitter from '@assets/icons/social/twitter.svg';

import website from '@assets/icons/website.svg';
import whitepaper from '@assets/icons/whitepaper.svg';

import nansenLogo from '@assets/images/credits/credits-nansen.svg';
import ensLogo from '@assets/images/ens/ensIcon.svg';
import coinGeckoLogo from '@assets/images/credits/credits-coingecko.svg';
import zapperLogo from '@assets/images/defizap/zapperLogo.svg';

const icons = {
  back,
  expand,

  'logo-mycrypto': logoMyCrypto,
  'logo-mycrypto-text': logoMyCryptoText,

  coinmarketcap,
  facebook,
  github,
  reddit,
  slack,
  telegram,
  twitter,

  website,
  whitepaper,

  nansenLogo,
  ensLogo,
  coinGeckoLogo,
  zapperLogo
};

const StyledInlineSVG = styled(InlineSVG)`
  svg {
    color: ${(props) => props.color};
  }
`;

interface Props extends Omit<InlineSVGProps, 'src'> {
  type: keyof typeof icons;
  color?: string;
}

const Icon: FunctionComponent<Props> = ({ type, ...props }) => (
  <StyledInlineSVG src={icons[type]} {...props} />
);

export default Icon;
