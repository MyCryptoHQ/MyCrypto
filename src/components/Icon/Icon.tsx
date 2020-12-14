import React from 'react';

import InlineSVG from 'react-inlinesvg';

import add from '@assets/icons/actions/add.svg';
import back from '@assets/icons/actions/back.svg';
import confirm from '@assets/icons/actions/confirm.svg';
import caret from '@assets/icons/actions/expand-purple.svg';
import expand from '@assets/icons/actions/expand.svg';
import infoSmall from '@assets/icons/actions/info-small.svg';
import info from '@assets/icons/actions/info.svg';
import logoMyCryptoText from '@assets/icons/brand/logo-text.svg';
import logoMyCrypto from '@assets/icons/brand/logo.svg';
import feedback from '@assets/icons/feedback.svg';
import mycWinterMembership from '@assets/icons/myc-winter-membership.svg';
import mycWinter from '@assets/icons/myc-winter.svg';
import navAddAccount from '@assets/icons/navigation/add-account.svg';
import navAssets from '@assets/icons/navigation/assets.svg';
import navBitcoin from '@assets/icons/navigation/bitcoin.svg';
import navBroadcastTransaction from '@assets/icons/navigation/broadcast-transaction.svg';
import navBuy from '@assets/icons/navigation/buy.svg';
import navCoinbase from '@assets/icons/navigation/coinbase.svg';
import navDeployContracts from '@assets/icons/navigation/deploy-contracts.svg';
import navEthereum from '@assets/icons/navigation/ethereum.svg';
import navHome from '@assets/icons/navigation/home.svg';
import navInteractWithContracts from '@assets/icons/navigation/interact-with-contracts.svg';
import navLedger from '@assets/icons/navigation/ledger.svg';
import navQuiknode from '@assets/icons/navigation/quiknode.svg';
import navReceive from '@assets/icons/navigation/receive.svg';
import navSend from '@assets/icons/navigation/send.svg';
import navSettings from '@assets/icons/navigation/settings.svg';
import navSignMessage from '@assets/icons/navigation/sign-message.svg';
import navSupportUs from '@assets/icons/navigation/support-us.svg';
import navSwap from '@assets/icons/navigation/swap.svg';
import navTools from '@assets/icons/navigation/tools.svg';
import navTrezor from '@assets/icons/navigation/trezor.svg';
import navUnstoppable from '@assets/icons/navigation/unstoppable.svg';
import navVerifyMessage from '@assets/icons/navigation/verify-message.svg';
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
import antLogo from '@assets/images/ant-logo.png';
import arrowRight from '@assets/images/arrow-right.svg';
import coinGeckoLogo from '@assets/images/credits/credits-coingecko.svg';
import nansenLogo from '@assets/images/credits/credits-nansen.svg';
import zapperLogo from '@assets/images/defizap/zapperLogo.svg';
import ensLogo from '@assets/images/ens/ens-icon.svg';
import golemLogo from '@assets/images/gol-logo.png';
import check from '@assets/images/icn-check.svg';
import experience from '@assets/images/icn-experience.svg';
import feeIcon from '@assets/images/icn-fee.svg';
import informational from '@assets/images/icn-info-blue.svg';
import more from '@assets/images/icn-more.svg';
import networkIcon from '@assets/images/icn-network.svg';
import platformUsed from '@assets/images/icn-platform-used.svg';
import questionWhite from '@assets/images/icn-question-white.svg';
import questionBlack from '@assets/images/icn-question.svg';
import receiveIcon from '@assets/images/icn-receive.svg';
import sendIcon from '@assets/images/icn-send.svg';
import sentIcon from '@assets/images/icn-sent.svg';
import closedEye from '@assets/images/icn-show-closed-eye-svg.svg';
import openedEye from '@assets/images/icn-show-eye.svg';
import statusBadgeDeclined from '@assets/images/icn-status-badge-declined.svg';
import statusBadgePending from '@assets/images/icn-status-badge-pending.svg';
import statusBadgeSuccess from '@assets/images/icn-status-badge-success.svg';
import warning from '@assets/images/icn-warning.svg';
import lendLogo from '@assets/images/lend-logo.png';
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
  caret,
  add,
  info,
  more,
  confirm,
  'info-small': infoSmall,
  'opened-eye': openedEye,
  'closed-eye': closedEye,
  'arrow-right': arrowRight,

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
  'myc-winter': mycWinter,
  'myc-winter-membership': mycWinterMembership,

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
  check,

  /* TX Receipt */
  'status-badge-success': statusBadgeSuccess,
  'status-badge-pending': statusBadgePending,
  'status-badge-declined': statusBadgeDeclined,
  'zapper-platform': platformUsed,
  'tx-fee': feeIcon,
  'tx-send': sendIcon,
  'tx-sent': sentIcon,
  'tx-receive': receiveIcon,
  'tx-network': networkIcon,

  /* Navigation */
  'nav-home': navHome,
  'nav-send': navSend,
  'nav-swap': navSwap,
  'nav-assets': navAssets,
  'nav-receive': navReceive,
  'nav-buy': navBuy,
  'nav-add-account': navAddAccount,
  'nav-tools': navTools,
  'nav-sign-message': navSignMessage,
  'nav-verify-message': navVerifyMessage,
  'nav-interact-with-contracts': navInteractWithContracts,
  'nav-deploy-contracts': navDeployContracts,
  'nav-broadcast-transaction': navBroadcastTransaction,
  'nav-support-us': navSupportUs,
  'nav-ledger': navLedger,
  'nav-trezor': navTrezor,
  'nav-quiknode': navQuiknode,
  'nav-coinbase': navCoinbase,
  'nav-unstoppable': navUnstoppable,
  'nav-settings': navSettings,
  'nav-ethereum': navEthereum,
  'nav-bitcoin': navBitcoin
};

const pngIcons = {
  /* Partner Icons */
  'uni-logo': uniLogo,
  'lend-logo': lendLogo,
  'ant-logo': antLogo,
  'gol-logo': golemLogo
};

type SvgIcons = keyof typeof svgIcons;
type PngIcons = keyof typeof pngIcons;
export type TIcon = SvgIcons | PngIcons;

interface Props extends Omit<React.ComponentProps<typeof InlineSVG>, 'src'> {
  type: TIcon;
  color?: string;
}

const Icon: React.FunctionComponent<Props> = ({ type, color, ...props }) => {
  return (
    <>
      {svgIcons[type as SvgIcons] && (
        <InlineSVG src={svgIcons[type as SvgIcons]} color={color} fill={color} {...props} />
      )}
      {pngIcons[type as PngIcons] && <img src={pngIcons[type as PngIcons]} {...props} />}
    </>
  );
};

export default Icon;
