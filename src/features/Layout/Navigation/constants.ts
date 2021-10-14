import { CRYPTOSCAMDB, EXT_URLS } from '@config';
import { IAppRoutes } from '@routing/routes';
import { translateRaw } from '@translations';
import { INavTray, IRouteLink } from '@types';

export const desktopLinks = (APP_ROUTES: IAppRoutes) => {
  const Links: IRouteLink[] = [
    {
      type: 'internal',
      title: translateRaw('NAVIGATION_HOME'),
      to: APP_ROUTES.DASHBOARD.path,
      enabled: APP_ROUTES.DASHBOARD.enabled,
      icon: 'nav-home'
    },
    {
      type: 'internal',
      title: translateRaw('NAVIGATION_SEND'),
      to: APP_ROUTES.SEND.path,
      enabled: APP_ROUTES.SEND.enabled,
      icon: 'nav-send'
    },
    {
      type: 'internal',
      title: translateRaw('NAVIGATION_SWAP'),
      to: APP_ROUTES.SWAP.path,
      enabled: APP_ROUTES.SWAP.enabled,
      icon: 'nav-swap'
    },
    {
      type: 'internal',
      title: translateRaw('NAVIGATION_RECEIVE'),
      to: APP_ROUTES.REQUEST_ASSETS.path,
      enabled: APP_ROUTES.REQUEST_ASSETS.enabled,
      icon: 'nav-receive'
    },
    {
      type: 'internal',
      title: translateRaw('NAVIGATION_BUY'),
      to: APP_ROUTES.BUY.path,
      enabled: APP_ROUTES.BUY.enabled,
      icon: 'nav-buy'
    },
    {
      type: 'internal',
      title: translateRaw('NAVIGATION_ADD_ACCOUNT'),
      to: APP_ROUTES.ADD_ACCOUNT.path,
      enabled: APP_ROUTES.ADD_ACCOUNT.enabled,
      icon: 'nav-add-account'
    }
  ];
  return Links;
};

export const toolsTray = (APP_ROUTES: IAppRoutes) => {
  const Links: INavTray = {
    type: 'tray',
    title: translateRaw('NAVIGATION_TOOLS'),
    enabled: true,
    icon: 'nav-tools',
    items: [
      {
        type: 'internal',
        title: translateRaw('NAVIGATION_SIGN_MESSAGE'),
        to: APP_ROUTES.SIGN_MESSAGE.path,
        enabled: APP_ROUTES.SIGN_MESSAGE.enabled,
        icon: 'nav-sign-message'
      },
      {
        type: 'internal',
        title: translateRaw('NAVIGATION_CONTRACTS'),
        to: APP_ROUTES.INTERACT_WITH_CONTRACTS.path,
        enabled: APP_ROUTES.INTERACT_WITH_CONTRACTS.enabled,
        icon: 'nav-interact-with-contracts'
      },
      {
        type: 'internal',
        title: translateRaw('NAVIGATION_BROADCAST_TRANSACTION'),
        to: APP_ROUTES.BROADCAST_TX.path,
        enabled: APP_ROUTES.BROADCAST_TX.enabled,
        icon: 'nav-broadcast-transaction'
      },
      {
        type: 'internal',
        to: APP_ROUTES.TX_STATUS.path,
        enabled: APP_ROUTES.TX_STATUS.enabled,
        title: translateRaw('NAVIGATION_TX_STATUS'),
        icon: 'nav-tx-status'
      },
      {
        type: 'internal',
        to: APP_ROUTES.ENS.path,
        enabled: APP_ROUTES.ENS.enabled,
        title: translateRaw('NAVIGATION_ENS'),
        icon: 'nav-ens'
      },
      {
        type: 'internal',
        to: APP_ROUTES.REP_TOKEN_MIGRATION.path,
        enabled: APP_ROUTES.REP_TOKEN_MIGRATION.enabled,
        title: translateRaw('NAVIGATION_MIGRATE_REP'),
        icon: 'nav-migrate-rep'
      },
      {
        type: 'internal',
        to: APP_ROUTES.GOLEM_TOKEN_MIGRATION.path,
        enabled: APP_ROUTES.GOLEM_TOKEN_MIGRATION.enabled,
        title: translateRaw('NAVIGATION_MIGRATE_GNT'),
        icon: 'nav-migrate-gnt'
      },
      {
        type: 'internal',
        to: APP_ROUTES.ANT_TOKEN_MIGRATION.path,
        enabled: APP_ROUTES.ANT_TOKEN_MIGRATION.enabled,
        title: translateRaw('NAVIGATION_MIGRATE_ANT'),
        icon: 'nav-migrate-ant'
      },
      {
        type: 'internal',
        to: APP_ROUTES.AAVE_TOKEN_MIGRATION.path,
        enabled: APP_ROUTES.AAVE_TOKEN_MIGRATION.enabled,
        title: translateRaw('NAVIGATION_MIGRATE_LEND'),
        icon: 'nav-migrate-lend'
      },
      {
        type: 'internal',
        to: APP_ROUTES.FAUCET.path,
        enabled: APP_ROUTES.FAUCET.enabled,
        title: translateRaw('NAVIGATION_FAUCET'),
        icon: 'nav-faucet'
      },
      {
        type: 'internal',
        to: APP_ROUTES.NFT_DASHBOARD.path,
        enabled: APP_ROUTES.NFT_DASHBOARD.enabled,
        title: translateRaw('NFT_DASHBOARD'),
        icon: 'nav-nft'
      }
    ]
  };
  return Links;
};

export const supportUsTray: INavTray = {
  type: 'tray',
  title: translateRaw('NAVIGATION_SUPPORT_US'),
  enabled: true,
  icon: 'nav-support-us',
  items: [
    {
      type: 'external',
      title: translateRaw('NAVIGATION_GET_A_LEDGER'),
      link: EXT_URLS.LEDGER_REFERRAL.url,
      icon: 'nav-ledger'
    },
    {
      type: 'external',
      title: translateRaw('NAVIGATION_GET_A_TREZOR'),
      link: EXT_URLS.TREZOR_REFERRAL.url,
      icon: 'nav-trezor'
    },
    {
      type: 'external',
      title: translateRaw('NAVIGATION_GET_QUICKNODE'),
      link: EXT_URLS.QUICKNODE_REFERRAL.url,
      icon: 'nav-quicknode'
    },
    {
      type: 'external',
      title: translateRaw('NAVIGATION_BUY_ETH'),
      link: EXT_URLS.COINBASE_REFERRAL.url,
      icon: 'nav-coinbase'
    },
    {
      type: 'external',
      title: translateRaw('NAVIGATION_UNSTOPPABLE'),
      link: EXT_URLS.UNSTOPPABLEDOMAINS_REFERRAL.url,
      icon: 'nav-unstoppable'
    }
  ]
};

export const settingsLinks = (APP_ROUTES: IAppRoutes) => {
  const link: IRouteLink = {
    type: 'internal',
    title: translateRaw('NAVIGATION_SETTINGS'),
    to: APP_ROUTES.SETTINGS.path,
    enabled: APP_ROUTES.SETTINGS.enabled,
    icon: 'nav-settings'
  };
  return link;
};

export const mobileLinks = (APP_ROUTES: IAppRoutes) => {
  const Links: (IRouteLink | INavTray)[] = [
    {
      type: 'internal',
      title: translateRaw('NAVIGATION_HOME'),
      to: APP_ROUTES.DASHBOARD.path,
      enabled: APP_ROUTES.DASHBOARD.enabled,
      icon: 'nav-home'
    },
    {
      type: 'internal',
      title: translateRaw('NAVIGATION_SEND'),
      to: APP_ROUTES.SEND.path,
      enabled: APP_ROUTES.SEND.enabled,
      icon: 'nav-send'
    },
    {
      type: 'tray',
      title: translateRaw('NAVIGATION_ASSETS'),
      enabled: true,
      icon: 'nav-assets',
      items: [
        {
          type: 'internal',
          title: translateRaw('NAVIGATION_SEND'),
          to: APP_ROUTES.SEND.path,
          enabled: APP_ROUTES.SEND.enabled,
          icon: 'nav-send'
        },
        {
          type: 'internal',
          title: translateRaw('NAVIGATION_SWAP'),
          to: APP_ROUTES.SWAP.path,
          enabled: APP_ROUTES.SWAP.enabled,
          icon: 'nav-swap'
        },
        {
          type: 'internal',
          title: translateRaw('NAVIGATION_RECEIVE'),
          to: APP_ROUTES.REQUEST_ASSETS.path,
          enabled: APP_ROUTES.REQUEST_ASSETS.enabled,
          icon: 'nav-receive'
        },
        {
          type: 'internal',
          title: translateRaw('NAVIGATION_BUY'),
          to: APP_ROUTES.BUY.path,
          enabled: APP_ROUTES.BUY.enabled,
          icon: 'nav-buy'
        }
      ]
    },
    {
      type: 'tray',
      title: translateRaw('NAVIGATION_TOOLS'),
      enabled: true,
      icon: 'nav-tools',
      items: [
        {
          type: 'internal',
          title: translateRaw('NAVIGATION_SIGN_MESSAGE'),
          to: APP_ROUTES.SIGN_MESSAGE.path,
          enabled: APP_ROUTES.SIGN_MESSAGE.enabled,
          icon: 'nav-sign-message'
        },
        {
          type: 'internal',
          title: translateRaw('NAVIGATION_CONTRACTS'),
          to: APP_ROUTES.INTERACT_WITH_CONTRACTS.path,
          enabled: APP_ROUTES.INTERACT_WITH_CONTRACTS.enabled,
          icon: 'nav-interact-with-contracts'
        },
        {
          type: 'internal',
          title: translateRaw('NAVIGATION_BROADCAST_TRANSACTION'),
          to: APP_ROUTES.BROADCAST_TX.path,
          enabled: APP_ROUTES.BROADCAST_TX.enabled,
          icon: 'nav-broadcast-transaction'
        },
        {
          type: 'internal',
          to: APP_ROUTES.TX_STATUS.path,
          enabled: APP_ROUTES.TX_STATUS.enabled,
          title: translateRaw('NAVIGATION_TX_STATUS'),
          icon: 'nav-tx-status'
        },
        {
          type: 'internal',
          to: APP_ROUTES.ENS.path,
          enabled: APP_ROUTES.ENS.enabled,
          title: translateRaw('NAVIGATION_ENS'),
          icon: 'nav-ens'
        },
        {
          type: 'internal',
          to: APP_ROUTES.REP_TOKEN_MIGRATION.path,
          enabled: APP_ROUTES.REP_TOKEN_MIGRATION.enabled,
          title: translateRaw('NAVIGATION_MIGRATE_REP'),
          icon: 'nav-migrate-rep'
        },
        {
          type: 'internal',
          to: APP_ROUTES.GOLEM_TOKEN_MIGRATION.path,
          enabled: APP_ROUTES.GOLEM_TOKEN_MIGRATION.enabled,
          title: translateRaw('NAVIGATION_MIGRATE_GNT'),
          icon: 'nav-migrate-gnt'
        },
        {
          type: 'internal',
          to: APP_ROUTES.ANT_TOKEN_MIGRATION.path,
          enabled: APP_ROUTES.ANT_TOKEN_MIGRATION.enabled,
          title: translateRaw('NAVIGATION_MIGRATE_ANT'),
          icon: 'nav-migrate-ant'
        },
        {
          type: 'internal',
          to: APP_ROUTES.AAVE_TOKEN_MIGRATION.path,
          enabled: APP_ROUTES.AAVE_TOKEN_MIGRATION.enabled,
          title: translateRaw('NAVIGATION_MIGRATE_LEND'),
          icon: 'nav-migrate-lend'
        },
        {
          type: 'internal',
          to: APP_ROUTES.FAUCET.path,
          enabled: APP_ROUTES.FAUCET.enabled,
          title: translateRaw('NAVIGATION_FAUCET'),
          icon: 'nav-faucet'
        },
        {
          type: 'internal',
          to: APP_ROUTES.NFT_DASHBOARD.path,
          enabled: APP_ROUTES.NFT_DASHBOARD.enabled,
          title: translateRaw('NFT_DASHBOARD'),
          icon: 'nav-nft'
        }
      ]
    },
    {
      type: 'internal',
      title: translateRaw('NAVIGATION_SETTINGS'),
      to: APP_ROUTES.SETTINGS.path,
      enabled: APP_ROUTES.SETTINGS.enabled,
      icon: 'nav-settings'
    }
  ];
  return Links;
};

export const socialLinks = [
  {
    link: 'https://twitter.com/mycrypto',
    icon: 'nav-twitter'
  },
  {
    link: 'https://www.facebook.com/mycryptoHQ/',
    icon: 'nav-facebook'
  },
  {
    link: 'https://instagram.com/mycryptohq',
    icon: 'nav-instagram'
  },
  {
    link: 'https://www.linkedin.com/company/mycrypto',
    icon: 'nav-linkedin'
  },
  {
    link: 'https://github.com/MyCryptoHQ',
    icon: 'nav-github'
  },
  {
    link: 'https://www.reddit.com/r/mycrypto/',
    icon: 'nav-reddit'
  },
  {
    link: 'https://discord.gg/VSaTXEA',
    icon: 'nav-discord'
  }
];

export const MYCLinks = [
  {
    title: translateRaw('NEW_FOOTER_TEXT_11'),
    link: 'https://blog.mycrypto.com/',
    icon: 'nav-blog'
  },
  {
    title: translateRaw('NEW_FOOTER_TEXT_8'),
    link: 'https://mycrypto.com/about',
    icon: 'nav-team'
  },
  {
    title: translateRaw('NEW_FOOTER_TEXT_9'),
    link: 'mailto:press@mycrypto.com',
    icon: 'nav-press'
  },
  {
    title: translateRaw('NEW_FOOTER_TEXT_10'),
    link: 'https://mycrypto.com/privacy/',
    icon: 'nav-privacy'
  },
  {
    title: translateRaw('NAVIGATION_DISCLAIMER'),
    link: 'https://mycrypto.com/disclaimer',
    icon: 'nav-disclaimer'
  }
];

export const productsLinks = [
  {
    title: 'EtherAddressLookup',
    link:
      'https://chrome.google.com/webstore/detail/etheraddresslookup/pdknmigbbbhmllnmgdfalmedcmcefdfn'
  },
  {
    title: 'CryptoScamDB',
    link: CRYPTOSCAMDB
  },
  {
    title: 'MoneroVision',
    link: 'https://monerovision.com/'
  },
  {
    title: 'FindETH',
    link: 'https://findeth.io'
  }
];
