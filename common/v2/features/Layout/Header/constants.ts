import { translateRaw } from 'translations';

export const linkset = {
  sendAndReceive: [
    {
      to: '/account',
      title: translateRaw('NEW_HEADER_TEXT_7'),
      accessMessage: translateRaw('ACCESS_MESSAGE_1')
    },
    {
      to: '/account/request',
      title: translateRaw('NEW_HEADER_TEXT_8'),
      accessMessage: translateRaw('ACCESS_MESSAGE_2')
    },
    {
      to: '/account/info',
      title: translateRaw('NEW_HEADER_TEXT_9'),
      accessMessage: translateRaw('ACCESS_MESSAGE_3')
    },
    {
      to: '/account/recent-txs',
      title: translateRaw('NEW_HEADER_TEXT_10'),
      accessMessage: translateRaw('ACCESS_MESSAGE_4')
    },
    {
      to: '/account/address-book',
      title: translateRaw('NEW_HEADER_TEXT_11'),
      accessMessage: translateRaw('ACCESS_MESSAGE_5')
    }
  ],
  buyAndExchange: [
    {
      to: '/swap',
      title: translateRaw('NEW_HEADER_TEXT_12')
    }
  ],
  tools: [
    {
      to: '/sign-and-verify-message',
      title: translateRaw('NEW_HEADER_TEXT_13')
    },
    {
      to: '/contracts',
      title: translateRaw('NEW_HEADER_TEXT_14')
    },
    {
      to: '/tx-status',
      title: translateRaw('NEW_HEADER_TEXT_15')
    },
    {
      to: '/pushTx',
      title: translateRaw('NEW_HEADER_TEXT_16')
    },
    {
      to: '/ens',
      title: translateRaw('NEW_HEADER_TEXT_17')
    }
  ]
};

export const links = {
  'Manage Assets': [
    {
      to: '/dashboard/send',
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
  ],
  Tools: [
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
  ],
  Settings: '/dashboard/settings',
  Dashboard: '/dashboard'
};
