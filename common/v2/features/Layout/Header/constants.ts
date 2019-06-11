import dashboardIcon from 'common/assets/images/icn-dashboard.svg';

export const links = [
  {
    title: 'Dashboard',
    to: '/dashboard',
    icon: { src: dashboardIcon, width: '16px', height: '12px' }
  },
  {
    title: 'Manage Assets',
    subItems: [
      {
        to: '/send',
        title: 'Send Assets'
      },
      {
        to: '/request',
        title: 'Receive Assets'
      },
      {
        to: '/swap',
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
  { title: 'Settings', to: '/settings' }
];
