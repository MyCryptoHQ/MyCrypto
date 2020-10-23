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
import feedback from '@assets/icons/feedback.svg';
import newsletter from '@assets/icons/newsletter.svg';
import coinmarketcap from '@assets/icons/social/coinmarketcap.svg';
import facebook from '@assets/icons/social/facebook.svg';
import github from '@assets/icons/social/github.svg';
import reddit from '@assets/icons/social/reddit.svg';
import slack from '@assets/icons/social/slack.svg';
import telegram from '@assets/icons/social/telegram.svg';
import twitter from '@assets/icons/social/twitter.svg';
import telegramIcon from '@assets/icons/telegram.svg';
import twitterIcon from '@assets/icons/twitter.svg';
import website from '@assets/icons/website.svg';
import whitepaper from '@assets/icons/whitepaper.svg';
import coinGeckoLogo from '@assets/images/credits/credits-coingecko.svg';
import nansenLogo from '@assets/images/credits/credits-nansen.svg';
import zapperLogo from '@assets/images/defizap/zapperLogo.svg';
import ensLogo from '@assets/images/ens/ens-icon.svg';
import check from '@assets/images/icn-check.svg';
import experience from '@assets/images/icn-experience.svg';
import informational from '@assets/images/icn-info-blue.svg';
import more from '@assets/images/icn-more.svg';
import questionWhite from '@assets/images/icn-question-white.svg';
import questionBlack from '@assets/images/icn-question.svg';
import warning from '@assets/images/icn-warning.svg';
import membership from '@assets/images/membership/membership-none.svg';
import repLogo from '@assets/images/rep-logo.svg';
import swap from '@assets/images/swap copy.svg';
import uniLogo from '@assets/images/uni-logo.png';
import ledgerIcon from '@assets/images/wallets/ledger.svg';
import trezorIcon from '@assets/images/wallets/trezor.svg';

const svgIcons = {
  /* Action icons */
  back,
  expand,
  'expand-purple': expandPurple,
  add,
  confirm,
  info,
  more,
  'info-small': infoSmall,

  /* Tooltips*/
  informational,
  questionWhite,
  questionBlack,
  warning,

  /* Noun icons */
  website,
  whitepaper,
  experience,
  'ledger-icon': ledgerIcon,
  'trezor-icon': trezorIcon,
  membership,
  feedback,
  newsletter,
  'telegram-icon': telegramIcon,
  swap,
  'twitter-icon': twitterIcon,

  /* Brand icons */
  'logo-mycrypto': logoMyCrypto,
  'logo-mycrypto-text': logoMyCryptoText,

  /* Partner Icons */
  nansenLogo,
  ensLogo,
  coinGeckoLogo,
  zapperLogo,
  'rep-logo': repLogo,

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

const pngIcons = {
  /* Partner Icons */
  'uni-logo': uniLogo
};

const SInlineSVG = styled(InlineSVG)`
  &&& svg {
    width: ${(props) => props.width};
    height: ${(props) => props.height};
    color: ${(props) => props.color};
  }
`;

type SvgIcons = keyof typeof svgIcons;
type PngIcons = keyof typeof pngIcons;
export type TIcon = SvgIcons | PngIcons;

interface Props extends Omit<React.ComponentProps<typeof InlineSVG>, 'src'> {
  type: TIcon;
  color?: string;
}

const Icon: React.FunctionComponent<Props> = ({ type, ...props }) => {
  return (
    <>
      {svgIcons[type as SvgIcons] && (
        <SInlineSVG src={svgIcons[type as SvgIcons]} color="red" {...props} />
      )}
      {pngIcons[type as PngIcons] && <img src={pngIcons[type as PngIcons]} {...props} />}
    </>
  );
};

export default Icon;
