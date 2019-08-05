import { ROUTE_PATHS } from 'v2/config';
import dashboardIcon from 'common/assets/images/icn-dashboard.svg';

export const links = [
  {
    title: 'Dashboard',
    to: ROUTE_PATHS.DASHBOARD.path,
    icon: { src: dashboardIcon, width: '16px', height: '12px' }
  },
  {
    title: 'Manage Assets',
    subItems: [
      {
        to: ROUTE_PATHS.SEND.path,
        title: 'Send Assets'
      },
      {
        to: ROUTE_PATHS.RECEIVE_ASSETS.path,
        title: 'Receive Assets'
      },
      {
        to: ROUTE_PATHS.SWAP.path,
        title: 'Swap Assets'
      }
    ]
  },
  {
    title: 'Tools',
    subItems: [
      {
        to: ROUTE_PATHS.SIGN_MESSAGE.path,
        title: 'Sign Message'
      },
      {
        to: ROUTE_PATHS.VERIFY_MESSAGE.path,
        title: 'Verify Message'
      },
      {
        to: '/contracts',
        title: 'Interact with Contracts'
      },
      {
        to: '/transaction-status',
        title: 'Check Transaction Status'
      },
      {
        to: '/broadcast-transaction',
        title: 'Broadcast Transaction'
      },
      {
        to: '/ens',
        title: 'ENS Domains'
      },
      {
        to: '/helpers',
        title: 'Helpers'
      }
    ]
  },
  {
    title: 'Settings',
    to: ROUTE_PATHS.SETTINGS.path
  }
];
