import { Action } from './types';

// Legacy
import buyIcon from 'common/assets/images/icn-buy.svg';
import swapIcon from 'common/assets/images/icn-swap.svg';
import sendIcon from 'common/assets/images/icn-send.svg';
import receiveIcon from 'common/assets/images/icn-receive.svg';
import LedgerIcon from 'common/assets/images/wallets/ledger.svg';
import TrezorIcon from 'common/assets/images/wallets/trezor.svg';

export const actions: Action[] = [
  {
    icon: buyIcon,
    title: 'Buy Assets',
    url: 'https://buy.mycrypto.com/',
    description: 'Purchase New Assets',
    tracking: 'Buy assets button clicked'
  },
  {
    icon: swapIcon,
    title: 'Swap Assets',
    path: '/swap',
    description: 'Exchange Assets for Other Assets',
    tracking: 'Swap button clicked'
  },
  {
    icon: sendIcon,
    title: 'Send Assets',
    path: '/send',
    description: 'Transfer Assets to Another Wallet',
    tracking: 'Send Assets button clicked'
  },
  {
    icon: receiveIcon,
    title: 'Request Assets',
    path: '/request',
    description: 'Transfer Assets to Your Wallet',
    tracking: 'Request assets button clicked'
  },
  {
    icon: [LedgerIcon, TrezorIcon],
    title: 'Get Hardware Wallet',
    url: [
      'https://www.ledgerwallet.com/r/1985?path=/products/',
      'https://shop.trezor.io/?offer_id=10&aff_id=1735'
    ],
    description: ['Protect your funds with Ledger', 'Protect your funds with TREZOR'],
    tracking: ['Buy Ledger button clicked', 'Buy TREZOR button clicked']
  }
];
