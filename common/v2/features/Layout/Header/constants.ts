import { ROUTE_PATHS } from 'v2/config';
import { translateRaw } from 'v2/translations';

import dashboardIcon from 'common/assets/images/icn-dashboard.svg';

export const links = [
  {
    title: 'Dashboard',
    to: ROUTE_PATHS.DASHBOARD.path,
    enabled: ROUTE_PATHS.DASHBOARD.featureStatus,
    icon: { src: dashboardIcon, width: '16px', height: '12px' }
  },
  {
    title: 'Manage Assets',
    enabled: true,
    subItems: [
      {
        to: ROUTE_PATHS.SEND.path,
        enabled: ROUTE_PATHS.SEND.featureStatus,
        title: translateRaw('SEND')
      },
      {
        to: ROUTE_PATHS.REQUEST_ASSETS.path,
        enabled: ROUTE_PATHS.REQUEST_ASSETS.featureStatus,
        title: translateRaw('REQUEST')
      },
      {
        to: ROUTE_PATHS.SWAP.path,
        enabled: ROUTE_PATHS.SWAP.featureStatus,
        title: translateRaw('SWAP')
      }
    ]
  },
  {
    title: 'Tools',
    enabled: true,
    subItems: [
      {
        to: ROUTE_PATHS.SIGN_MESSAGE.path,
        enabled: ROUTE_PATHS.SIGN_MESSAGE.featureStatus,
        title: 'Sign Message'
      },
      {
        to: ROUTE_PATHS.VERIFY_MESSAGE.path,
        enabled: ROUTE_PATHS.VERIFY_MESSAGE.featureStatus,
        title: 'Verify Message'
      },
      {
        to: ROUTE_PATHS.BROADCAST_TX.path,
        enabled: ROUTE_PATHS.BROADCAST_TX.featureStatus,
        title: 'Broadcast Transaction'
      },
      {
        to: ROUTE_PATHS.INTERACT_WITH_CONTRACTS.path,
        enabled: ROUTE_PATHS.INTERACT_WITH_CONTRACTS.featureStatus,
        title: 'Interact with Contracts'
      },
      {
        to: ROUTE_PATHS.DEPLOY_CONTRACTS.path,
        enabled: ROUTE_PATHS.DEPLOY_CONTRACTS.featureStatus,
        title: 'Deploy Contracts'
      },
      {
        to: '/helpers',
        title: 'Helpers'
      }
    ]
  },
  {
    title: 'Settings',
    to: ROUTE_PATHS.SETTINGS.path,
    enabled: ROUTE_PATHS.SETTINGS.featureStatus
  }
];
