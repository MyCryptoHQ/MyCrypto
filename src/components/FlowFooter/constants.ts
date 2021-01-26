import {
  EXT_URLS,
  getKBHelpArticle,
  KB_HELP_ARTICLE,
  ROUTE_PATHS,
  SUPPORT_EMAIL,
  WALLETS_CONFIG
} from '@config';
import { FlowFooterConfig, WalletId } from '@types';
import { getWeb3Config } from '@utils';

const web3Config = getWeb3Config();

const SUPPORT_LINK = {
  copy: 'FLOW_FOOTER_SUPPORT',
  link: `mailto:${SUPPORT_EMAIL}`,
  external: true
};

export const configs: Record<
  FlowFooterConfig,
  { copy: string; link?: string; copyVariables?: any; external?: boolean }[]
> = {
  GENERAL: [
    { copy: 'FLOW_FOOTER_GENERAL_1', link: ROUTE_PATHS.CREATE_WALLET.path },
    { copy: 'FLOW_FOOTER_GENERAL_2', link: ROUTE_PATHS.DOWNLOAD_DESKTOP_APP.path },
    { copy: 'FLOW_FOOTER_GENERAL_3', link: ROUTE_PATHS.SETTINGS_IMPORT.path },
    SUPPORT_LINK
  ],
  METAMASK_SIGN: [
    {
      copy: 'FLOW_FOOTER_TROUBLESHOOTING',
      link: getKBHelpArticle(KB_HELP_ARTICLE.MIGRATE_TO_METAMASK),
      external: true
    },
    SUPPORT_LINK
  ],
  METAMASK_UNLOCK: [
    {
      copy: 'FLOW_FOOTER_GET_WEB3',
      copyVariables: { $app: WALLETS_CONFIG[WalletId.METAMASK].name },
      link: WALLETS_CONFIG[WalletId.METAMASK].install!.getItLink!,
      external: true
    },
    {
      copy: 'FLOW_FOOTER_METAMASK_1',
      link: getKBHelpArticle(KB_HELP_ARTICLE.MIGRATE_TO_METAMASK),
      external: true
    },
    SUPPORT_LINK
  ],
  GENERIC_WEB3: [
    {
      copy: 'FLOW_FOOTER_GET_WEB3',
      copyVariables: { $app: web3Config.name },
      link: web3Config.install?.getItLink,
      external: true
    },
    SUPPORT_LINK
  ],
  LEDGER: [
    {
      copy: 'FLOW_FOOTER_LEDGER_1',
      link: EXT_URLS.LEDGER_REFERRAL.url,
      external: true
    },
    {
      copy: 'FLOW_FOOTER_TROUBLESHOOTING',
      link: getKBHelpArticle(KB_HELP_ARTICLE.TREZOR_TROUBLESHOOTING),
      external: true
    },
    SUPPORT_LINK
  ],
  TREZOR: [
    {
      copy: 'FLOW_FOOTER_TREZOR_1',
      link: EXT_URLS.TREZOR_REFERRAL.url,
      external: true
    },
    {
      copy: 'FLOW_FOOTER_TROUBLESHOOTING',
      link: getKBHelpArticle(KB_HELP_ARTICLE.TREZOR_TROUBLESHOOTING),
      external: true
    },
    SUPPORT_LINK
  ],
  WALLETCONNECT: [
    {
      copy: 'FLOW_FOOTER_WALLETCONNECT_1',
      link: getKBHelpArticle(KB_HELP_ARTICLE.WHAT_IS_WALLETCONNECT),
      external: true
    },
    {
      copy: 'FLOW_FOOTER_WALLETCONNECT_2',
      link: getKBHelpArticle(KB_HELP_ARTICLE.HOW_TO_USE_WALLETCONNECT),
      external: true
    },
    SUPPORT_LINK
  ],
  SUPPORT: [SUPPORT_LINK]
};
