import { Action } from './types';

// Legacy
import buyIcon from 'common/assets/images/icn-buy.svg';
import swapIcon from 'common/assets/images/icn-swap.svg';
import sendIcon from 'common/assets/images/icn-send.svg';
import receiveIcon from 'common/assets/images/icn-receive.svg';
import hardwareWalletIcon from 'common/assets/images/icn-hardware-wallet.svg';

export const actions: Action[] = [
  {
    icon: buyIcon,
    title: 'Buy Assets',
    link: '/buyAssets',
    description: 'Purchase New Assets'
  },
  {
    icon: swapIcon,
    title: 'Swap Assets',
    link: '/swapAssets',
    description: 'Exchange Assets for Other Assets'
  },
  {
    icon: sendIcon,
    title: 'Send Assets',
    link: '/sendAssets',
    description: 'Transfer Assets to Another Wallet'
  },
  {
    icon: receiveIcon,
    title: 'Request Assets',
    link: '/requestAssets',
    description: 'Transfer Assets to Your Wallet'
  },
  {
    icon: hardwareWalletIcon,
    title: 'Get Hardware Wallet',
    link: '/dashboard/get-hardware-wallet',
    description: 'Keep Your Funds Safe Offline'
  }
];
