/*
  Circular dependencies stop this file from beinging in v2/routes where
  it really belongs.
*/

import React, { ComponentType } from 'react';
import { Redirect } from 'react-router-dom';

import { isDesktop } from 'v2/utils';

import { CreateWallet, Mnemonic, Keystore } from './CreateWallet';
import { Dashboard } from './Dashboard';
import { AddAccountFlow } from './AddAccount';
import { Settings, Import, Export } from './Settings';
import { DownloadApp } from './DownloadApp';
import { NoAccounts } from './NoAccounts';
import { ScreenLockNew, ScreenLockLocked, ScreenLockForgotPassword } from './ScreenLock';
import { SendAssets } from './SendAssets';
import { RequestAssets } from './RequestAssets';
import { BuyAndExchange, ShapeShiftAuthorization, ZeroEx } from './BuyAndExchange';

const DownloadAppRedirect = () => <Redirect to="/download-desktop-app" />;
const requiresDesktopApp = (component: ComponentType): ComponentType =>
  isDesktop() ? component : DownloadAppRedirect;

export default [
  {
    name: 'Dashboard',
    path: '/dashboard',
    exact: true,
    component: Dashboard
  },
  {
    name: 'Add Account',
    path: '/add-account/:walletName?',
    exact: true,
    component: AddAccountFlow
  },
  {
    name: 'Create Wallet',
    path: '/create-wallet',
    exact: true,
    component: requiresDesktopApp(CreateWallet)
  },
  {
    name: 'Mnemonic',
    path: '/create-wallet/mnemonic',
    exact: true,
    component: requiresDesktopApp(Mnemonic)
  },
  {
    name: 'Keystore',
    path: '/create-wallet/keystore',
    exact: true,
    component: requiresDesktopApp(Keystore)
  },
  {
    name: 'Download Desktop App',
    path: '/download-desktop-app',
    exact: true,
    component: DownloadApp
  },
  {
    name: 'No Accounts',
    path: '/no-accounts',
    exact: true,
    component: NoAccounts
  },
  {
    name: 'Request Assets',
    path: '/request',
    exact: true,
    component: RequestAssets
  },
  {
    name: 'Screen Lock New',
    path: '/screen-lock/new',
    exact: true,
    component: ScreenLockNew
  },
  {
    name: 'Screen Lock Locked',
    path: '/screen-lock/locked',
    exact: true,
    component: ScreenLockLocked
  },
  {
    name: 'Screen Lock Forgot Password',
    path: '/screen-lock/forgot-password',
    exact: true,
    component: ScreenLockForgotPassword
  },
  {
    name: 'Send Assets',
    path: '/send',
    exact: true,
    component: SendAssets
  },
  {
    name: 'Settings',
    path: '/settings',
    exact: true,
    component: Settings
  },
  {
    name: 'Import',
    path: '/settings/import',
    exact: true,
    component: Import
  },
  {
    name: 'Export',
    path: '/settings/import',
    exact: true,
    component: Export
  },
  {
    name: 'Buy and Exchange | Select Exchange',
    path: '/swap',
    exact: true,
    component: BuyAndExchange
  },
  {
    name: 'Buy and Exchange | ShapeShift',
    path: '/swap/shapeshift',
    component: ShapeShiftAuthorization
  },
  {
    name: 'Buy and Exchange | 0x Instant',
    path: '/swap/0x',
    component: ZeroEx
  }
];
