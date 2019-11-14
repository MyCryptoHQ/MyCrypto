import React from 'react';
import { Redirect } from 'react-router-dom';

import { IAppRoute } from 'v2/types';
import { ROUTE_PATHS } from 'v2/config';
import {
  AddAccountFlow,
  CreateWallet,
  Mnemonic,
  Keystore,
  Dashboard,
  Settings,
  Import,
  Export,
  DownloadApp,
  NoAccounts,
  ScreenLockNew,
  ScreenLockLocked,
  ScreenLockForgotPassword,
  SendAssets,
  ReceiveAssets,
  SwapAssetsFlow,
  Home,
  SignAndVerifyMessage,
  BroadcastTransactionFlow,
  InteractWithContractsFlow
} from 'v2/features';
import { requiresDesktopApp } from './helpers';

const DownloadAppRedirect = () => <Redirect to={ROUTE_PATHS.DOWNLOAD_DESKTOP_APP.path} />;

export const APP_ROUTES: IAppRoute[] = [
  {
    name: ROUTE_PATHS.HOME.name,
    title: ROUTE_PATHS.HOME.title,
    path: ROUTE_PATHS.HOME.path,
    exact: true,
    seperateLayout: true,
    component: Home
  },
  {
    name: ROUTE_PATHS.DASHBOARD.name,
    title: ROUTE_PATHS.DASHBOARD.title,
    path: ROUTE_PATHS.DASHBOARD.path,
    exact: true,
    requireAccounts: true,
    component: Dashboard
  },
  {
    name: ROUTE_PATHS.ADD_ACCOUNT.name,
    title: ROUTE_PATHS.ADD_ACCOUNT.title,
    path: `${ROUTE_PATHS.ADD_ACCOUNT.path}/:walletName?`,
    exact: true,
    component: AddAccountFlow
  },
  {
    name: ROUTE_PATHS.CREATE_WALLET.name,
    title: ROUTE_PATHS.CREATE_WALLET.title,
    path: ROUTE_PATHS.CREATE_WALLET.path,
    exact: true,
    component: requiresDesktopApp(CreateWallet)(DownloadAppRedirect)
  },
  {
    name: ROUTE_PATHS.CREATE_WALLET_MNEMONIC.name,
    title: ROUTE_PATHS.CREATE_WALLET_MNEMONIC.title,
    path: ROUTE_PATHS.CREATE_WALLET_MNEMONIC.path,
    exact: true,
    component: requiresDesktopApp(Mnemonic)(DownloadAppRedirect)
  },
  {
    name: ROUTE_PATHS.CREATE_WALLET_KEYSTORE.name,
    title: ROUTE_PATHS.CREATE_WALLET_KEYSTORE.title,
    path: ROUTE_PATHS.CREATE_WALLET_KEYSTORE.path,
    exact: true,
    component: requiresDesktopApp(Keystore)(DownloadAppRedirect)
  },
  {
    name: ROUTE_PATHS.DOWNLOAD_DESKTOP_APP.name,
    title: ROUTE_PATHS.DOWNLOAD_DESKTOP_APP.title,
    path: ROUTE_PATHS.DOWNLOAD_DESKTOP_APP.path,
    exact: true,
    component: DownloadApp
  },
  {
    name: ROUTE_PATHS.NO_ACCOUNTS.name,
    title: ROUTE_PATHS.NO_ACCOUNTS.title,
    path: ROUTE_PATHS.NO_ACCOUNTS.path,
    exact: true,
    component: NoAccounts
  },
  {
    name: ROUTE_PATHS.RECEIVE_ASSETS.name,
    title: ROUTE_PATHS.RECEIVE_ASSETS.title,
    path: ROUTE_PATHS.RECEIVE_ASSETS.path,
    exact: true,
    requireAccounts: true,
    component: ReceiveAssets
  },
  {
    name: ROUTE_PATHS.SCREEN_LOCK_NEW.name,
    title: ROUTE_PATHS.SCREEN_LOCK_NEW.title,
    path: ROUTE_PATHS.SCREEN_LOCK_NEW.path,
    exact: true,
    component: ScreenLockNew
  },
  {
    name: ROUTE_PATHS.SCREEN_LOCK_LOCKED.name,
    title: ROUTE_PATHS.SCREEN_LOCK_LOCKED.title,
    path: ROUTE_PATHS.SCREEN_LOCK_LOCKED.path,
    exact: true,
    component: ScreenLockLocked
  },
  {
    name: ROUTE_PATHS.SCREEN_LOCK_FORGOT.name,
    title: ROUTE_PATHS.SCREEN_LOCK_FORGOT.title,
    path: ROUTE_PATHS.SCREEN_LOCK_FORGOT.path,
    exact: true,
    component: ScreenLockForgotPassword
  },
  {
    name: ROUTE_PATHS.SEND.name,
    title: ROUTE_PATHS.SEND.title,
    path: ROUTE_PATHS.SEND.path,
    exact: true,
    requireAccounts: true,
    component: SendAssets
  },
  {
    name: ROUTE_PATHS.SETTINGS.name,
    title: ROUTE_PATHS.SETTINGS.title,
    path: ROUTE_PATHS.SETTINGS.path,
    exact: true,
    component: Settings
  },
  {
    name: ROUTE_PATHS.SETTINGS_IMPORT.name,
    title: ROUTE_PATHS.SETTINGS_IMPORT.title,
    path: ROUTE_PATHS.SETTINGS_IMPORT.path,
    exact: true,
    component: Import
  },
  {
    name: ROUTE_PATHS.SETTINGS_EXPORT.name,
    title: ROUTE_PATHS.SETTINGS_EXPORT.title,
    path: ROUTE_PATHS.SETTINGS_EXPORT.path,
    exact: true,
    component: Export
  },
  {
    name: ROUTE_PATHS.SWAP.name,
    title: ROUTE_PATHS.SWAP.title,
    path: ROUTE_PATHS.SWAP.path,
    exact: true,
    component: SwapAssetsFlow
  },
  {
    name: ROUTE_PATHS.SIGN_MESSAGE.name,
    title: ROUTE_PATHS.SIGN_MESSAGE.title,
    path: ROUTE_PATHS.SIGN_MESSAGE.path,
    exact: true,
    component: SignAndVerifyMessage
  },
  {
    name: ROUTE_PATHS.VERIFY_MESSAGE.name,
    title: ROUTE_PATHS.VERIFY_MESSAGE.title,
    path: ROUTE_PATHS.VERIFY_MESSAGE.path,
    exact: true,
    component: SignAndVerifyMessage
  },
  {
    name: ROUTE_PATHS.BROADCAST_TX.name,
    title: ROUTE_PATHS.BROADCAST_TX.title,
    path: ROUTE_PATHS.BROADCAST_TX.path,
    component: BroadcastTransactionFlow
  },
  {
    name: ROUTE_PATHS.INTERACT_WITH_CONTRACTS.name,
    title: ROUTE_PATHS.INTERACT_WITH_CONTRACTS.title,
    path: ROUTE_PATHS.INTERACT_WITH_CONTRACTS.path,
    component: InteractWithContractsFlow
  }
];
