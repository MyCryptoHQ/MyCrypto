import { translateRaw } from 'translations';

export const LINKSET = {
  SEND_AND_RECEIVE: [
    {
      to: '/account',
      title: translateRaw('NEW_HEADER_TEXT_7')
    },
    {
      to: '/account/request',
      title: translateRaw('NEW_HEADER_TEXT_8')
    },
    {
      to: '/account/info',
      title: translateRaw('NEW_HEADER_TEXT_9')
    },
    {
      to: '/account/recent-txs',
      title: translateRaw('NEW_HEADER_TEXT_10')
    },
    {
      to: '/account/address-book',
      title: translateRaw('NEW_HEADER_TEXT_11')
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
