import buyIcon from '@assets/images/icn-buy.svg';
import sendIcon from '@assets/images/icn-send.svg';
import swapIcon from '@assets/images/icn-swap.svg';
import { ROUTE_PATHS } from '@config';
import { translateRaw } from '@translations';

import { Action } from './types';

export const actions: Action[] = [
  {
    icon: sendIcon,
    title: translateRaw('DASHBOARD_ACTIONS_SEND_ASSETS_TITLE'),
    link: ROUTE_PATHS.SEND.path,
    description: translateRaw('DASHBOARD_ACTIONS_SEND_ASSETS_SUBTITLE')
  },
  {
    icon: swapIcon,
    title: translateRaw('DASHBOARD_ACTIONS_SWAP_ASSETS_TITLE'),
    link: ROUTE_PATHS.SWAP.path,
    description: translateRaw('DASHBOARD_ACTIONS_SWAP_ASSETS_SUBTITLE')
  },
  {
    icon: buyIcon,
    title: translateRaw('DASHBOARD_ACTIONS_BUY_TITLE'),
    link: ROUTE_PATHS.BUY.path,
    description: translateRaw('DASHBOARD_ACTIONS_BUY_SUBTITLE')
  }
];
