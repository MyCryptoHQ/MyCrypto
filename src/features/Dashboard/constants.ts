import buyIcon from '@assets/images/icn-buy.svg';
import receiveIcon from '@assets/images/icn-receive.svg';
import sendIcon from '@assets/images/icn-send.svg';
import swapIcon from '@assets/images/icn-swap.svg';
import repIcon from '@assets/images/rep-logo.svg';
import ledgerIcon from '@assets/images/wallets/ledger.svg';
import trezorIcon from '@assets/images/wallets/trezor.svg';
import { EXT_URLS, REPV1UUID, ROUTE_PATHS } from '@config';
import { translateRaw } from '@translations';
import { StoreAsset } from '@types';

import { Action } from './types';

const selectRandomAction = (actionsList: Action[]) =>
  actionsList[Math.floor(Math.random() * actionsList.length)];

const hardwareWallets: Action[] = [
  {
    icon: ledgerIcon,
    faded: true,
    title: translateRaw('DASHBOARD_ACTIONS_GET_WALLET_TITLE'),
    link: EXT_URLS.LEDGER_REFERRAL.url,
    description: translateRaw('DASHBOARD_ACTIONS_GET_WALLET_SUBTITLE', { $wallet: 'Ledger' })
  },
  {
    icon: trezorIcon,
    faded: true,
    title: translateRaw('DASHBOARD_ACTIONS_GET_WALLET_TITLE'),
    link: EXT_URLS.TREZOR_REFERRAL.url,
    description: translateRaw('DASHBOARD_ACTIONS_GET_WALLET_SUBTITLE', { $wallet: 'Trezor' })
  }
];

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
    icon: receiveIcon,
    title: translateRaw('DASHBOARD_ACTIONS_REQUEST_ASSETS_TITLE'),
    link: ROUTE_PATHS.REQUEST_ASSETS.path,
    description: translateRaw('DASHBOARD_ACTIONS_REQUEST_ASSETS_SUBTITLE')
  },
  {
    icon: buyIcon,
    title: translateRaw('DASHBOARD_ACTIONS_BUY_TITLE'),
    link: ROUTE_PATHS.BUY.path,
    description: translateRaw('DASHBOARD_ACTIONS_BUY_SUBTITLE')
  },
  selectRandomAction(hardwareWallets),
  {
    icon: repIcon,
    title: translateRaw('DASHBOARD_ACTIONS_REP_MIGRATION_TITLE'),
    link: ROUTE_PATHS.REP_TOKEN_MIGRATION.path,
    description: translateRaw('DASHBOARD_ACTIONS_REP_MIGRATION_SUBTITLE'),
    assetFilter: (asset: StoreAsset) => asset.uuid === REPV1UUID
  }
];
