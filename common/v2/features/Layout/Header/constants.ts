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
        to: ROUTE_PATHS.REQUEST_ASSEST.path,
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
        to: '/sign-message',
        title: 'Sign Message'
      },
      {
        to: '/verify-message',
        title: 'Verify Message'
      },
      {
        to: '/contracts',
        title: 'Interact with Contracts'
      },
      {
        to: '/broadcast-transaction',
        title: 'Broadcast Transaction'
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
