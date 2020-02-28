import { IRoutePath, IRoutePaths } from 'v2/types';
import { translateRaw } from 'v2/translations';

const PATHS: IRoutePath[] = [
  {
    name: 'ROOT',
    path: '/'
  },
  {
    name: 'BUY',
    title: translateRaw('BUY'),
    path: 'https://buy.mycrypto.com/'
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
    title: 'Download Desktop App',
    path: '/download-desktop-app'
  },
  {
    name: 'NO_ACCOUNTS',
    title: 'No Accounts',
    path: '/no-accounts'
  },
  {
    name: 'REQUEST_ASSETS',
    title: translateRaw('REQUEST'),
    path: '/request'
  },
  {
    name: 'SCREEN_LOCK_NEW',
    title: 'Screen Lock New',
    path: '/screen-lock/new'
  },
  {
    name: 'SCREEN_LOCK_LOCKED',
    title: 'Screen Lock Locked',
    path: '/screen-lock/locked'
  },
  {
    name: 'SCREEN_LOCK_FORGOT',
    title: 'Screen Lock Forgot Password',
    path: '/screen-lock/forgot-password'
  },
  {
    name: 'SEND',
    title: 'Send Assets',
    path: '/send'
  },
  {
    name: 'DEFIZAP',
    title: 'DeFiZap',
    path: '/defi/zap'
  },
  {
    name: 'SETTINGS',
    title: 'Settings',
    path: '/settings'
  },
  {
    name: 'SETTINGS_IMPORT',
    title: 'Import',
    path: '/settings/import'
  },
  {
    name: 'SETTINGS_EXPORT',
    title: 'Export',
    path: '/settings/export'
  },
  {
    name: 'SWAP',
    title: 'Buy and Exchange',
    path: '/swap'
  },
  {
    name: 'SIGN_MESSAGE',
    title: 'Sign Message',
    path: '/sign-message'
  },
  {
    name: 'VERIFY_MESSAGE',
    title: 'Verify Message',
    path: '/verify-message'
  },
  {
    name: 'BROADCAST_TX',
    title: 'Broadcast Transaction',
    path: '/broadcast-transaction'
  },
  {
    name: 'INTERACT_WITH_CONTRACTS',
    title: 'Interact With Contracts',
    path: '/interact-with-contracts'
  },
  {
    name: 'DEPLOY_CONTRACTS',
    title: 'Deploy Contracts',
    path: '/deploy-contracts'
  }
];

function createNavLinksFromRoutePaths(paths: IRoutePath[]) {
  return paths.reduce((navLinks, path) => {
    navLinks[path.name] = path;
    return navLinks;
  }, {} as IRoutePaths);
}

export const ROUTE_PATHS: IRoutePaths = createNavLinksFromRoutePaths(PATHS);
