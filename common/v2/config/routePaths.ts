import { IRoutePath, IRoutePaths } from 'v2/types';

const PATHS: IRoutePath[] = [
  {
    name: 'ROOT',
    path: '/'
  },
  {
    name: 'BUY',
    title: 'Buy Crypto',
    path: 'https://buy.mycrypto.com/'
  },
  {
    name: 'HOME',
    title: 'home',
    path: '/home'
  },
  {
    name: 'DASHBOARD',
    title: 'Dashboard',
    path: '/dashboard'
  },
  {
    name: 'ADD_ACCOUNT',
    title: 'Add Account',
    path: '/add-account'
  },
  {
    name: 'CREATE_WALLET',
    title: 'Create Wallet',
    path: '/create-wallet'
  },
  {
    name: 'CREATE_WALLET_MNEMONIC',
    title: 'Mnemonic',
    path: '/create-wallet/mnemonic'
  },
  {
    name: 'CREATE_WALLET_KEYSTORE',
    title: 'Keystore',
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
    name: 'RECEIVE_ASSETS',
    title: 'Receive Assets',
    path: '/receive'
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
  }
];

function createNavLinksFromRoutePaths(paths: IRoutePath[]) {
  return paths.reduce(
    (navLinks, path) => {
      navLinks[path.name] = path;
      return navLinks;
    },
    {} as IRoutePaths
  );
}

export const ROUTE_PATHS: IRoutePaths = createNavLinksFromRoutePaths(PATHS);
