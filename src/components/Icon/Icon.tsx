import { ComponentProps } from 'react';

import shouldForwardProp from '@styled-system/should-forward-prop';
import InlineSVG from 'react-inlinesvg';
import styled, { css } from 'styled-components';
import {
  color,
  ColorProps,
  colorStyle,
  ColorStyleProps,
  layout,
  LayoutProps,
  space,
  SpaceProps
} from 'styled-system';

import genericAssetIcon from '@assets/generic.svg';
import add from '@assets/icons/actions/add.svg';
import addBold from '@assets/icons/actions/add_bold.svg';
import back from '@assets/icons/actions/back.svg';
import completedTaskIcon from '@assets/icons/actions/completed.svg';
import confirm from '@assets/icons/actions/confirm.svg';
import downCaret from '@assets/icons/actions/down-caret.svg';
import edit from '@assets/icons/actions/edit.svg';
import expandable from '@assets/icons/actions/expand-default.svg';
import caret from '@assets/icons/actions/expand-purple.svg';
import expand from '@assets/icons/actions/expand.svg';
import infoSmall from '@assets/icons/actions/info-small.svg';
import info from '@assets/icons/actions/info.svg';
import refresh from '@assets/icons/actions/refresh.svg';
import remove from '@assets/icons/actions/remove.svg';
import logoMyCryptoTextBlue from '@assets/icons/brand/logo-text-blue.svg';
import logoMyCryptoText from '@assets/icons/brand/logo-text.svg';
import logoMyCrypto from '@assets/icons/brand/logo.svg';
import feedback from '@assets/icons/feedback.svg';
import navAddAccount from '@assets/icons/navigation/add-account.svg';
import navAssets from '@assets/icons/navigation/assets.svg';
import navBitcoin from '@assets/icons/navigation/bitcoin.svg';
import navBlog from '@assets/icons/navigation/blog.svg';
import navBroadcastTransaction from '@assets/icons/navigation/broadcast-transaction.svg';
import navBuy from '@assets/icons/navigation/buy.svg';
import navClose from '@assets/icons/navigation/close.svg';
import navCoinbase from '@assets/icons/navigation/coinbase.svg';
import navDeployContracts from '@assets/icons/navigation/deploy-contracts.svg';
import navDesktop from '@assets/icons/navigation/desktop.svg';
import navDisclaimer from '@assets/icons/navigation/disclaimer.svg';
import navDiscord from '@assets/icons/navigation/discord.svg';
import navEns from '@assets/icons/navigation/ens.svg';
import navEthereum from '@assets/icons/navigation/ethereum.svg';
import navFacebook from '@assets/icons/navigation/facebook.svg';
import navFaucet from '@assets/icons/navigation/faucet.svg';
import navGithub from '@assets/icons/navigation/github.svg';
import navHelp from '@assets/icons/navigation/help.svg';
import navHome from '@assets/icons/navigation/home.svg';
import navInstagram from '@assets/icons/navigation/instagram.svg';
import navInteractWithContracts from '@assets/icons/navigation/interact-with-contracts.svg';
import navLedger from '@assets/icons/navigation/ledger.svg';
import navLinkedin from '@assets/icons/navigation/linkedin.svg';
import navMedium from '@assets/icons/navigation/medium.svg';
import navMembership from '@assets/icons/navigation/membership.svg';
import navMenu from '@assets/icons/navigation/menu.svg';
import navMigrateAnt from '@assets/icons/navigation/migrate-ant.svg';
import navMigrateGnt from '@assets/icons/navigation/migrate-gnt.svg';
import navMigrateLend from '@assets/icons/navigation/migrate-lend.svg';
import navMigrateRep from '@assets/icons/navigation/migrate-rep.svg';
import navNew from '@assets/icons/navigation/new.svg';
import navNewTab from '@assets/icons/navigation/newTab.svg';
import navNftDashboard from '@assets/icons/navigation/nft-dashboard.svg';
import navPress from '@assets/icons/navigation/press.svg';
import navPrivacy from '@assets/icons/navigation/privacy.svg';
import navQuicknode from '@assets/icons/navigation/quicknode.svg';
import navReceive from '@assets/icons/navigation/receive.svg';
import navReddit from '@assets/icons/navigation/reddit.svg';
import navSend from '@assets/icons/navigation/send.svg';
import navSettings from '@assets/icons/navigation/settings.svg';
import navSignMessage from '@assets/icons/navigation/sign-message.svg';
import navSupportUs from '@assets/icons/navigation/support-us.svg';
import navSwap from '@assets/icons/navigation/swap.svg';
import navTeam from '@assets/icons/navigation/team.svg';
import navTools from '@assets/icons/navigation/tools.svg';
import navTrezor from '@assets/icons/navigation/trezor.svg';
import navTwitter from '@assets/icons/navigation/twitter.svg';
import navTxStatus from '@assets/icons/navigation/tx-status.svg';
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
import zeroxLogo from '@assets/images/credits/credits-0x.svg';
import coinGeckoLogo from '@assets/images/credits/credits-coingecko.svg';
import nansenLogo from '@assets/images/credits/credits-nansen.svg';
import openSeaLogo from '@assets/images/credits/credits-opensea.svg';
import zapperLogo from '@assets/images/defizap/zapperLogo.svg';
import ensLogo from '@assets/images/ens/ens-icon.svg';
import golemLogo from '@assets/images/gol-logo.png';
import addressBookIcon from '@assets/images/icn-address-book.svg';
import buyIcon from '@assets/images/icn-buy.svg';
import check from '@assets/images/icn-check.svg';
import trezorLgIcon from '@assets/images/icn-connect-trezor-new.svg';
import experience from '@assets/images/icn-experience.svg';
import faucetIcon from '@assets/images/icn-faucet.svg';
import feeIcon from '@assets/images/icn-fee.svg';
import informational from '@assets/images/icn-info-blue.svg';
import ledgerLgIcon from '@assets/images/icn-ledger-nano-large.svg';
import more from '@assets/images/icn-more.svg';
import networkIcon from '@assets/images/icn-network.svg';
import platformUsed from '@assets/images/icn-platform-used.svg';
import questionWhite from '@assets/images/icn-question-white.svg';
import questionBlack from '@assets/images/icn-question.svg';
import receiveIcon from '@assets/images/icn-receive.svg';
import sendIcon from '@assets/images/icn-send.svg';
import sentIcon from '@assets/images/icn-sent.svg';
import separator from '@assets/images/icn-separator.svg';
import closedEye from '@assets/images/icn-show-closed-eye-svg.svg';
import openedEye from '@assets/images/icn-show-eye.svg';
import statusBadgeDeclined from '@assets/images/icn-status-badge-declined.svg';
import statusBadgePending from '@assets/images/icn-status-badge-pending.svg';
import statusBadgeSuccess from '@assets/images/icn-status-badge-success.svg';
import swapFlip from '@assets/images/icn-swap-flip.svg';
import swap from '@assets/images/icn-swap.svg';
import warning from '@assets/images/icn-warning.svg';
import lendLogo from '@assets/images/lend-logo.png';
import linkOutIcon from '@assets/images/link-out.svg';
import membership from '@assets/images/membership/membership-none.svg';
import nodeLogo from '@assets/images/node-logo.svg';
import repLogo from '@assets/images/rep-logo.svg';
import uniLogo from '@assets/images/uni-logo.png';
import ledgerIcon from '@assets/images/wallets/ledger.svg';
import trezorIcon from '@assets/images/wallets/trezor.svg';

const svgIcons = {
  /* Action icons */
  back,
  expand,
  edit,
  caret,
  add,
  info,
  more,
  confirm,
  refresh,
  expandable,
  remove,
  'add-bold': addBold,
  'info-small': infoSmall,
  'opened-eye': openedEye,
  'closed-eye': closedEye,
  'arrow-right': arrowRight,
  'faucet-icon': faucetIcon,
  'down-caret': downCaret,
  'link-out': linkOutIcon,
  'swap-flip': swapFlip,
  'action-completed': completedTaskIcon,
  buy: buyIcon,

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
  'ledger-icon-lg': ledgerLgIcon,
  'trezor-icon': trezorIcon,
  'trezor-icon-lg': trezorLgIcon,
  membership,
  feedback,
  newsletter,
  'telegram-icon': telegramIcon,
  swap,
  'twitter-icon': twitterIcon,
  'address-book': addressBookIcon,
  'generic-asset-icon': genericAssetIcon,

  /* Brand icons */
  'logo-mycrypto': logoMyCrypto,
  'logo-mycrypto-text': logoMyCryptoText,
  'logo-mycrypto-text-blue': logoMyCryptoTextBlue,

  /* Partner Icons */
  nansenLogo,
  openSeaLogo,
  ensLogo,
  coinGeckoLogo,
  zapperLogo,
  'rep-logo': repLogo,
  zeroxLogo,

  /* Social Icons */
  coinmarketcap,
  facebook,
  github,
  reddit,
  slack,
  telegram,
  twitter,
  check,

  /* MISC */
  separator,

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
  'nav-quicknode': navQuicknode,
  'nav-coinbase': navCoinbase,
  'nav-unstoppable': navUnstoppable,
  'nav-settings': navSettings,
  'nav-ethereum': navEthereum,
  'nav-bitcoin': navBitcoin,
  'nav-membership': navMembership,
  'nav-help': navHelp,
  'nav-new': navNew,
  'nav-menu': navMenu,
  'nav-close': navClose,
  'nav-twitter': navTwitter,
  'nav-facebook': navFacebook,
  'nav-medium': navMedium,
  'nav-instagram': navInstagram,
  'nav-linkedin': navLinkedin,
  'nav-github': navGithub,
  'nav-reddit': navReddit,
  'nav-discord': navDiscord,
  'nav-team': navTeam,
  'nav-press': navPress,
  'nav-privacy': navPrivacy,
  'nav-blog': navBlog,
  'nav-new-tab': navNewTab,
  'nav-desktop': navDesktop,
  'nav-ens': navEns,
  'nav-tx-status': navTxStatus,
  'nav-migrate-rep': navMigrateRep,
  'nav-migrate-gnt': navMigrateGnt,
  'nav-migrate-ant': navMigrateAnt,
  'nav-migrate-lend': navMigrateLend,
  'nav-faucet': navFaucet,
  'nav-disclaimer': navDisclaimer,
  'nav-nft': navNftDashboard
};

const pngIcons = {
  /* Partner Icons */
  'uni-logo': uniLogo,
  'lend-logo': lendLogo,
  'ant-logo': antLogo,
  'gol-logo': golemLogo,
  'node-logo': nodeLogo
};

type SvgIcons = keyof typeof svgIcons;
type PngIcons = keyof typeof pngIcons;
export type TIcon = SvgIcons | PngIcons;

type StylingProps = LayoutProps & SpaceProps & ColorProps & ColorStyleProps;

const SInlineSVG = styled(InlineSVG).withConfig({ shouldForwardProp })<
  StylingProps & { fill: string }
>`
  ${layout}
  ${space}
  ${color}
  ${colorStyle}
  fill: ${({ fill, theme }) => (fill ? theme.colors[fill] : fill)};
`;

const SImg = styled.img<StylingProps>`
  ${layout}
  ${space}
  ${color}
  ${colorStyle}
`;

// This specific svg is designed with strokes instead of fill
// so we give make sure the fill is not set.
const SStrokeIcon = styled(SInlineSVG)<StylingProps>`
  &&&& {
    fill: transparent;
  }
  &&&&:hover {
    fill: transparent;
  }
  stroke: ${({ color }) => color && color};
`;

const SExpandableIcon = styled(SInlineSVG)<StylingProps>`
  cursor: pointer;
  transition: all 0.3s ease-out;
  transform: ${({ isExpanded }) => (isExpanded ? `rotate(180deg)` : `rotate(90deg)`)};
`;

const SSortIcon = styled(SInlineSVG)<StylingProps>`
  cursor: pointer;
  transition: all 0.3s ease-out;
  ${({ isActive }) =>
    isActive ? css({ transform: `rotate(0deg)` }) : css({ transform: `rotate(180deg)` })};
`;

const SNavCloseIcon = styled(SInlineSVG)<StylingProps>`
  cursor: pointer;
  transition: all 300ms ease;
  fill: ${(props) => (props.color ? props.color : props.theme.colors.discrete)};
  &:hover {
    transform: rotate(90deg);
  }
`;

const SDeleteIcon = styled(SInlineSVG)<StylingProps>`
  cursor: pointer;
  transition: all 300ms ease;
  fill: ${(props) => (props.color ? props.color : props.theme.colors.discrete)};
  &:hover {
    fill: ${(props) => props.theme.colors.warning};
    transform: rotate(90deg);
  }
`;

interface Props
  extends Omit<ComponentProps<typeof SInlineSVG | typeof SImg | typeof SStrokeIcon>, 'src'> {
  type: TIcon | 'sort' | 'delete';
}

export const isSVGType = (type: TIcon): type is SvgIcons =>
  typeof svgIcons[type as SvgIcons] !== 'undefined';
export const isPNGType = (type: TIcon): type is PngIcons =>
  typeof pngIcons[type as PngIcons] !== 'undefined';
export const getSVGIcon = (type: SvgIcons) => svgIcons[type];

const Icon = ({ type, color, ...props }: Props) => {
  if (type === 'website' || type === 'faucet-icon' || type === 'nav-nft') {
    return <SStrokeIcon src={svgIcons[type]} color={color} {...props} />;
  } else if (type === 'expandable') {
    return <SExpandableIcon src={svgIcons[type]} color={color} {...props} />;
  } else if (type === 'sort') {
    return <SSortIcon src={svgIcons['expandable']} fill={color} {...props} />;
  } else if (type === 'nav-close') {
    return <SNavCloseIcon src={svgIcons[type]} color={color} {...props} />;
  } else if (type === 'delete') {
    return <SDeleteIcon src={svgIcons['nav-close']} color={color} {...props} />;
  } else if (type === 'address-book') {
    return <SInlineSVG src={svgIcons[type]} fill="none" {...props} />;
  } else if (type === 'tx-sent') {
    return <SInlineSVG src={svgIcons[type]} fill="none" {...props} />;
  } else if (type === 'tx-fee') {
    return <SInlineSVG src={svgIcons[type]} fill="none" {...props} />;
  } else if (type === 'link-out') {
    return <SInlineSVG src={svgIcons[type]} fill="none" {...props} />;
  } else if (isSVGType(type) && (color || props.fill)) {
    return <SInlineSVG src={svgIcons[type]} color={color} fill={color} {...props} />;
  } else if (isSVGType(type)) {
    return <SImg src={svgIcons[type]} {...props} />;
  } else if (isPNGType(type)) {
    return <SImg src={pngIcons[type]} {...props} />;
  } else {
    throw new Error('[Icon]: Invalid type property');
  }
};

export default Icon;
