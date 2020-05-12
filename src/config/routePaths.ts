import { IRoutePath, IRoutePaths } from '@types';
import { translateRaw } from '@translations';

const PATHS: IRoutePath[] = [
  {
    name: 'ROOT',
    path: '/'
  },
  {
    name: 'BUY',
    title: translateRaw('BUY'),
    path: '/buy'
  },
  {
    name: 'HOME',
    title: translateRaw('HOME'),
    path: '/home'
  },
  {
    name: 'DASHBOARD',
    title: translateRaw('DASHBOARD'),
    path: '/dashboard'
  },
  {
    name: 'ADD_ACCOUNT',
    title: translateRaw('ADD_ACCOUNT'),
    path: '/add-account'
  },
  {
    name: 'CREATE_WALLET',
    title: translateRaw('CREATE_WALLET'),
    path: '/create-wallet'
  },
  {
    name: 'CREATE_WALLET_MNEMONIC',
    title: translateRaw('CREATE_WALLET_MNEMONIC'),
    path: '/create-wallet/mnemonic'
  },
  {
    name: 'CREATE_WALLET_KEYSTORE',
    title: translateRaw('CREATE_WALLET_KEYSTORE'),
    path: '/create-wallet/keystore'
  },
  {
    name: 'DOWNLOAD_DESKTOP_APP',
    title: translateRaw('DOWNLOAD_DESKTOP_APP'),
    path: '/download-desktop-app'
  },
  {
    name: 'NO_ACCOUNTS',
    title: translateRaw('NO_ACCOUNTS'),
    path: '/no-accounts'
  },
  {
    name: 'REQUEST_ASSETS',
    title: translateRaw('REQUEST'),
    path: '/request'
  },
  {
    name: 'SCREEN_LOCK_NEW',
    title: translateRaw('SCREEN_LOCK_NEW'),
    path: '/screen-lock/new'
  },
  {
    name: 'SCREEN_LOCK_LOCKED',
    title: translateRaw('SCREEN_LOCK_LOCKED'),
    path: '/screen-lock/locked'
  },
  {
    name: 'SCREEN_LOCK_FORGOT',
    title: translateRaw('SCREEN_LOCK_FORGOT'),
    path: '/screen-lock/forgot-password'
  },
  {
    name: 'SEND',
    title: translateRaw('SEND_ASSETS'),
    path: '/send'
  },
  {
    name: 'DEFIZAP',
    title: translateRaw('DEFIZAP'),
    path: '/defi/zap'
  },
  {
    name: 'SETTINGS',
    title: translateRaw('SETTINGS'),
    path: '/settings'
  },
  {
    name: 'SETTINGS_IMPORT',
    title: translateRaw('SETTINGS_IMPORT'),
    path: '/settings/import'
  },
  {
    name: 'SETTINGS_EXPORT',
    title: translateRaw('SETTINGS_EXPORT'),
    path: '/settings/export'
  },
  {
    name: 'SWAP',
    title: translateRaw('SWAP_ROUTE_TITLE'),
    path: '/swap'
  },
  {
    name: 'SIGN_MESSAGE',
    title: translateRaw('SIGN_MESSAGE'),
    path: '/sign-message'
  },
  {
    name: 'VERIFY_MESSAGE',
    title: translateRaw('VERIFY_MESSAGE'),
    path: '/verify-message'
  },
  {
    name: 'BROADCAST_TX',
    title: translateRaw('BROADCAST_TX'),
    path: '/broadcast-transaction'
  },
  {
    name: 'INTERACT_WITH_CONTRACTS',
    title: translateRaw('INTERACT_WITH_CONTRACTS'),
    path: '/interact-with-contracts'
  },
  {
    name: 'DEPLOY_CONTRACTS',
    title: translateRaw('DEPLOY_CONTRACTS'),
    path: '/deploy-contracts'
  },
  {
    name: 'MYC_MEMBERSHIP',
    title: translateRaw('MYC_MEMBERSHIP'),
    path: '/membership'
  },
  {
    name: 'MYC_MEMBERSHIP_BUY',
    title: 'MyCrypto Membership',
    path: '/membership/buy'
  },
  {
    name: 'ENS',
    title: 'Ethereum Name Service',
    path: '/ens'
  }
];

function createNavLinksFromRoutePaths(paths: IRoutePath[]) {
  return paths.reduce((navLinks, path) => {
    navLinks[path.name] = path;
    return navLinks;
  }, {} as IRoutePaths);
}

export const ROUTE_PATHS: IRoutePaths = createNavLinksFromRoutePaths(PATHS);
