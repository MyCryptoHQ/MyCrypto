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
        to: '/dashboard/receive',
        title: 'Receive Assets'
      },
      {
        to: '/dashboard/request',
        title: 'Request Assets'
      },
      {
        to: '/dashboard/swap',
        title: 'Swap Assets'
      },
      {
        to: '/dashboard/info',
        title: 'Wallet Info'
      },
      {
        to: '/dashboard/recent',
        title: 'Recent Transactions'
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
  { title: 'Settings', to: '/dashboard/settings' }
];
