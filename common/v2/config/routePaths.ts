import { IRoutePath, IRoutePaths } from 'v2/types';
import { translateRaw } from 'v2/translations';
import { FEATURE_STATUS } from './featureStatusMatrix';

const PATHS: IRoutePath[] = [
  {
    name: 'ROOT',
    path: '/',
    featureStatus: true
  },
  {
    name: 'BUY',
    title: translateRaw('BUY'),
    path: 'https://buy.mycrypto.com/',
    featureStatus: FEATURE_STATUS.BUY
  },
  {
    name: 'HOME',
    title: translateRaw('HOME'),
    path: '/home',
    featureStatus: true
  },
  {
    name: 'DASHBOARD',
    title: translateRaw('DASHBOARD'),
    path: '/dashboard',
    featureStatus: FEATURE_STATUS.DASHBOARD
  },
  {
    name: 'ADD_ACCOUNT',
    title: translateRaw('ADD_ACCOUNT'),
    path: '/add-account',
    featureStatus: FEATURE_STATUS.ADD_ACCOUNT
  },
  {
    name: 'CREATE_WALLET',
    title: translateRaw('CREATE_WALLET'),
    path: '/create-wallet',
    featureStatus: FEATURE_STATUS.CREATE_WALLET
  },
  {
    name: 'CREATE_WALLET_MNEMONIC',
    title: translateRaw('CREATE_WALLET_MNEMONIC'),
    path: '/create-wallet/mnemonic',
    featureStatus: FEATURE_STATUS.CREATE_WALLET
  },
  {
    name: 'CREATE_WALLET_KEYSTORE',
    title: translateRaw('CREATE_WALLET_KEYSTORE'),
    path: '/create-wallet/keystore',
    featureStatus: FEATURE_STATUS.CREATE_WALLET
  },
  {
    name: 'DOWNLOAD_DESKTOP_APP',
    title: 'Download Desktop App',
    path: '/download-desktop-app',
    featureStatus: FEATURE_STATUS.DOWNLOAD_DESKTOP_APP
  },
  {
    name: 'NO_ACCOUNTS',
    title: 'No Accounts',
    path: '/no-accounts',
    featureStatus: true
  },
  {
    name: 'REQUEST_ASSETS',
    title: translateRaw('REQUEST'),
    path: '/request',
    featureStatus: FEATURE_STATUS.REQUEST_ASSETS
  },
  {
    name: 'SCREEN_LOCK_NEW',
    title: 'Screen Lock New',
    path: '/screen-lock/new',
    featureStatus: FEATURE_STATUS.SCREEN_LOCK
  },
  {
    name: 'SCREEN_LOCK_LOCKED',
    title: 'Screen Lock Locked',
    path: '/screen-lock/locked',
    featureStatus: FEATURE_STATUS.SCREEN_LOCK
  },
  {
    name: 'SCREEN_LOCK_FORGOT',
    title: 'Screen Lock Forgot Password',
    path: '/screen-lock/forgot-password',
    featureStatus: FEATURE_STATUS.SCREEN_LOCK
  },
  {
    name: 'SEND',
    title: 'Send Assets',
    path: '/send',
    featureStatus: FEATURE_STATUS.SEND_ASSETS
  },
  {
    name: 'SETTINGS',
    title: 'Settings',
    path: '/settings',
    featureStatus: FEATURE_STATUS.SETTINGS
  },
  {
    name: 'SETTINGS_IMPORT',
    title: 'Import',
    path: '/settings/import',
    featureStatus: FEATURE_STATUS.SETTINGS
  },
  {
    name: 'SETTINGS_EXPORT',
    title: 'Export',
    path: '/settings/export',
    featureStatus: FEATURE_STATUS.SETTINGS
  },
  {
    name: 'SWAP',
    title: 'Buy and Exchange',
    path: '/swap',
    featureStatus: FEATURE_STATUS.SWAP
  },
  {
    name: 'SIGN_MESSAGE',
    title: 'Sign Message',
    path: '/sign-message',
    featureStatus: FEATURE_STATUS.SIGN_MESSAGE
  },
  {
    name: 'VERIFY_MESSAGE',
    title: 'Verify Message',
    path: '/verify-message',
    featureStatus: FEATURE_STATUS.VERIFY_MESSAGE
  },
  {
    name: 'BROADCAST_TX',
    title: 'Broadcast Transaction',
    path: '/broadcast-transaction',
    featureStatus: FEATURE_STATUS.BROADCAST_TX
  },
  {
    name: 'INTERACT_WITH_CONTRACTS',
    title: 'Interact With Contracts',
    path: '/interact-with-contracts',
    featureStatus: FEATURE_STATUS.CONTRACT_INTERACT
  },
  {
    name: 'DEPLOY_CONTRACTS',
    title: 'Deploy Contracts',
    path: '/deploy-contracts',
    featureStatus: FEATURE_STATUS.CONTRACT_DEPLOY
  }
];

function createNavLinksFromRoutePaths(paths: IRoutePath[]) {
  return paths.reduce((navLinks, path) => {
    navLinks[path.name] = path;
    return navLinks;
  }, {} as IRoutePaths);
}

export const ROUTE_PATHS: IRoutePaths = createNavLinksFromRoutePaths(PATHS);
