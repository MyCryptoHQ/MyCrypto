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
