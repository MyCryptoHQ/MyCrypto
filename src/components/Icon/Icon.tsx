import React from 'react';

import InlineSVG from 'react-inlinesvg';
import styled from 'styled-components';

import add from '@assets/icons/actions/add.svg';
import back from '@assets/icons/actions/back.svg';
import confirm from '@assets/icons/actions/confirm.svg';
import expandPurple from '@assets/icons/actions/expand-purple.svg';
import expand from '@assets/icons/actions/expand.svg';
import infoSmall from '@assets/icons/actions/info-small.svg';
import info from '@assets/icons/actions/info.svg';
import logoMyCryptoText from '@assets/icons/brand/logo-text.svg';
import logoMyCrypto from '@assets/icons/brand/logo.svg';
import coinmarketcap from '@assets/icons/social/coinmarketcap.svg';
import facebook from '@assets/icons/social/facebook.svg';
import github from '@assets/icons/social/github.svg';
import reddit from '@assets/icons/social/reddit.svg';
import slack from '@assets/icons/social/slack.svg';
import telegram from '@assets/icons/social/telegram.svg';
import twitter from '@assets/icons/social/twitter.svg';
import website from '@assets/icons/website.svg';
import whitepaper from '@assets/icons/whitepaper.svg';
import coinGeckoLogo from '@assets/images/credits/credits-coingecko.svg';
import nansenLogo from '@assets/images/credits/credits-nansen.svg';
import zapperLogo from '@assets/images/defizap/zapperLogo.svg';
import ensLogo from '@assets/images/ens/ensIcon.svg';
import check from '@assets/images/icn-check.svg';

const icons = {
  /* Action icons */
  back,
  expand,
  'expand-purple': expandPurple,
  add,
  confirm,
  info,
  'info-small': infoSmall,

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
