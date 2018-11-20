import { translateRaw } from 'translations';

export const LINKSET = {
  SEND_AND_RECEIVE: [
    {
      to: '/account',
      title: translateRaw('NEW_HEADER_TEXT_7'),
      accessMessage: 'You must access your wallet in order to send a transaction.'
    },
    {
      to: '/account/request',
      title: translateRaw('NEW_HEADER_TEXT_8'),
      accessMessage: 'You must access your wallet in order to request a payment.'
    },
    {
      to: '/account/info',
      title: translateRaw('NEW_HEADER_TEXT_9'),
      accessMessage: "You must access your wallet in order to view your wallet's information."
    },
    {
      to: '/account/recent-txs',
      title: translateRaw('NEW_HEADER_TEXT_10'),
      accessMessage: 'You must access your wallet in order to view your recent transactions.'
    },
    {
      to: '/account/address-book',
      title: translateRaw('NEW_HEADER_TEXT_11'),
      accessMessage: 'You must access your wallet in order to view your address book.'
    }
  ],
  BUY_AND_EXCHANGE: [
    {
      to: '/swap',
      title: translateRaw('NEW_HEADER_TEXT_12')
    }
  ],
  TOOLS: [
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
