import { ROUTE_PATHS, EXT_URLS } from 'v2/config';
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
    link: ROUTE_PATHS.BUY.path,
    description: 'Purchase New Assets'
  },
  {
    icon: swapIcon,
    title: 'Swap Assets',
    link: ROUTE_PATHS.SWAP.path,
    description: 'Exchange Assets for Other Assets'
  },
  {
    icon: sendIcon,
    title: 'Send Assets',
    link: ROUTE_PATHS.SEND.path,
    description: 'Transfer Assets to Another Wallet'
  },
  {
    icon: receiveIcon,
    title: 'Receive Assets',
    link: ROUTE_PATHS.REQUEST_ASSEST.path,
    description: 'Transfer Assets to Your Wallet'
  },
  {
    icon: hardwareWalletIcon,
    title: 'Get Hardware Wallet',
    link: EXT_URLS.LEDGER_REFERRAL.path,
    description: 'Keep Your Funds Safe Offline'
  }
];
