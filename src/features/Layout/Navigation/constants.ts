import { EXT_URLS } from '@config';
import { IAppRoutes } from '@routing/routes';
import { translateRaw } from '@translations';
import { INavTray, IRouteLink } from '@types';

//const APP_ROUTES_OBJECT = getAppRoutesObject(featureFlags);

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
        title: translateRaw('NAVIGATION_VERIFY_MESSAGE'),
        to: APP_ROUTES.VERIFY_MESSAGE.path,
        enabled: APP_ROUTES.VERIFY_MESSAGE.enabled,
        icon: 'nav-verify-message'
      },
      {
        type: 'internal',
        title: translateRaw('NAVIGATION_INTERACT_WITH_CONTRACTS'),
        to: APP_ROUTES.INTERACT_WITH_CONTRACTS.path,
        enabled: APP_ROUTES.INTERACT_WITH_CONTRACTS.enabled,
        icon: 'nav-interact-with-contracts'
      },
      {
        type: 'internal',
        title: translateRaw('NAVIGATION_DEPLOY_CONTRACTS'),
        to: APP_ROUTES.DEPLOY_CONTRACTS.path,
        enabled: APP_ROUTES.DEPLOY_CONTRACTS.enabled,
        icon: 'nav-deploy-contracts'
      },
      {
        type: 'internal',
        title: translateRaw('NAVIGATION_BROADCAST_TRANSACTION'),
        to: APP_ROUTES.BROADCAST_TX.path,
        enabled: APP_ROUTES.BROADCAST_TX.enabled,
        icon: 'nav-broadcast-transaction'
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
      icon: 'nav-ledger',
      analyticsEvent: 'Ledger Wallet'
    },
    {
      type: 'external',
      title: translateRaw('NAVIGATION_GET_A_TREZOR'),
      link: EXT_URLS.TREZOR_REFERRAL.url,
      icon: 'nav-trezor',
      analyticsEvent: 'TREZOR'
    },
    {
      type: 'external',
      title: translateRaw('NAVIGATION_GET_QUIKNODE'),
      link: EXT_URLS.QUIKNODE_REFERRAL.url,
      icon: 'nav-quiknode',
      analyticsEvent: 'Quiknode'
    },
    {
      type: 'external',
      title: translateRaw('NAVIGATION_BUY_ETH'),
      link: EXT_URLS.COINBASE_REFERRAL.url,
      icon: 'nav-coinbase',
      analyticsEvent: 'Coinbase'
    },
    {
      type: 'external',
      title: translateRaw('NAVIGATION_UNSTOPPABLE'),
      link: EXT_URLS.UNSTOPPABLEDOMAINS_REFERRAL.url,
      icon: 'nav-unstoppable',
      analyticsEvent: 'UnstoppableDomains'
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
          title: translateRaw('NAVIGATION_VERIFY_MESSAGE'),
          to: APP_ROUTES.VERIFY_MESSAGE.path,
          enabled: APP_ROUTES.VERIFY_MESSAGE.enabled,
          icon: 'nav-verify-message'
        },
        {
          type: 'internal',
          title: translateRaw('NAVIGATION_INTERACT_WITH_CONTRACTS'),
          to: APP_ROUTES.INTERACT_WITH_CONTRACTS.path,
          enabled: APP_ROUTES.INTERACT_WITH_CONTRACTS.enabled,
          icon: 'nav-interact-with-contracts'
        },
        {
          type: 'internal',
          title: translateRaw('NAVIGATION_DEPLOY_CONTRACTS'),
          to: APP_ROUTES.DEPLOY_CONTRACTS.path,
          enabled: APP_ROUTES.DEPLOY_CONTRACTS.enabled,
          icon: 'nav-deploy-contracts'
        },
        {
          type: 'internal',
          title: translateRaw('NAVIGATION_BROADCAST_TRANSACTION'),
          to: APP_ROUTES.BROADCAST_TX.path,
          enabled: APP_ROUTES.BROADCAST_TX.enabled,
          icon: 'nav-broadcast-transaction'
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
