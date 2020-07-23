import React from 'react';
import styled from 'styled-components';
import InlineSVG from 'react-inlinesvg';

import back from '@assets/icons/actions/back.svg';
import expand from '@assets/icons/actions/expand.svg';
import website from '@assets/icons/website.svg';
import whitepaper from '@assets/icons/whitepaper.svg';
import logoMyCrypto from '@assets/icons/brand/logo.svg';
import logoMyCryptoText from '@assets/icons/brand/logo-text.svg';
import nansenLogo from '@assets/images/credits/credits-nansen.svg';
import ensLogo from '@assets/images/ens/ensIcon.svg';
import coinGeckoLogo from '@assets/images/credits/credits-coingecko.svg';
import zapperLogo from '@assets/images/defizap/zapperLogo.svg';
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
import check from '@assets/images/icn-check.svg';

const icons = {
  /* Action icons */
  back,
  expand,

  /* Noun icons */
  website,
  whitepaper,

  /* Brand icons */
  'logo-mycrypto': logoMyCrypto,
  'logo-mycrypto-text': logoMyCryptoText,

  /* Partner Icons */
  nansenLogo,
  ensLogo,
  coinGeckoLogo,
  zapperLogo,

  /* Social Icons */
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
  zapperLogo,
  check
};

const SInlineSVG = styled(InlineSVG)`
  svg {
    color: ${(props) => props.color};
  }
`;

interface Props extends Omit<React.ComponentProps<typeof InlineSVG>, 'src'> {
  type: keyof typeof icons;
  color?: string;
}

const Icon: React.FunctionComponent<Props> = ({ type, ...props }) => (
  <SInlineSVG src={icons[type]} {...props} />
);

export default Icon;
