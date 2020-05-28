import React, { lazy } from 'react';
import { Redirect } from 'react-router-dom';

import { IAppRoute } from '@types';
import { ROUTE_PATHS, IS_ACTIVE_FEATURE } from '@config';
import { Home, Dashboard, NoAccounts } from '@features';
import { requiresDesktopApp } from './helpers';

const CreateWallet = lazy(() =>
  import(/* webpackChunkName: "CreateWallet" */ '@features/CreateWallet/CreateWallet')
);
const AddAccountFlow = lazy(() =>
  import(/* webpackChunkName: "AddAccountFlow" */ '@features/AddAccount/AddAccountFlow')
);
const SendAssets = lazy(() =>
  import(/* webpackChunkName: "SendAssets" */ '@features/SendAssets/SendAssets')
);
const Mnemonic = lazy(() =>
  import(/* webpackChunkName: "Mnemonic" */ '@features/CreateWallet/Mnemonic/Mnemonic')
);
const Keystore = lazy(() =>
  import(/* webpackChunkName: "Keystore" */ '@features/CreateWallet/Keystore/Keystore')
);
const Settings = lazy(() =>
  import(/* webpackChunkName: "Settings" */ '@features/Settings/Settings')
);
const Import = lazy(() =>
  import(/* webpackChunkName: "Import" */ '@features/Settings/Import/Import')
);
const Export = lazy(() =>
  import(/* webpackChunkName: "Export" */ '@features/Settings/Export/Export')
);
const DownloadApp = lazy(() =>
  import(/* webpackChunkName: "DownloadApp" */ '@features/DownloadApp/DownloadApp')
);
const ScreenLockNew = lazy(() =>
  import(/* webpackChunkName: "ScreenLockNew" */ '@features/ScreenLock/ScreenLockNew')
);
const ScreenLockLocked = lazy(() =>
  import(/* webpackChunkName: "ScreenLockLocked" */ '@features/ScreenLock/ScreenLockLocked')
);
const ScreenLockForgotPassword = lazy(() =>
  import(
    /* webpackChunkName: "ScreenLockForgotPassword" */ '@features/ScreenLock/ScreenLockForgotPassword'
  )
);
const ReceiveAssets = lazy(() =>
  import(/* webpackChunkName: "ReceiveAssets" */ '@features/ReceiveAssets/ReceiveAssets')
);
const SwapAssetsFlow = lazy(() =>
  import(/* webpackChunkName: "SwapAssetsFlow" */ '@features/SwapAssets/SwapAssetsFlow')
);
const SignAndVerifyMessage = lazy(() =>
  import(
    /* webpackChunkName: "SignAndVerifyMessage" */ '@features/SignAndVerifyMessage/SignAndVerifyMessage'
  )
);
const BroadcastTransactionFlow = lazy(() =>
  import(
    /* webpackChunkName: "BroadcastTransactionFlow" */ '@features/BroadcastTransaction/BroadcastTransactionFlow'
  )
);
const InteractWithContractsFlow = lazy(() =>
  import(
    /* webpackChunkName: "InteractWithContractsFlow" */ '@features/InteractWithContracts/InteractWithContractsFlow'
  )
);
const DeployContractsFlow = lazy(() =>
  import(
    /* webpackChunkName: "DeployContractsFlow" */ '@features/DeployContracts/DeployContractsFlow'
  )
);
const DeFiZapFlow = lazy(() =>
  import(/* webpackChunkName: "DeFiZapFlow" */ '@features/DeFiZap/DeFiZapFlow')
);
const PurchaseMembershipStepper = lazy(() =>
  import(
    /* webpackChunkName: "PurchaseMembershipStepper" */ '@features/PurchaseMembership/PurchaseMembershipStepper'
  )
);
const MembershipEducation = lazy(() =>
  import(
    /* webpackChunkName: "MembershipEducation" */ '@features/PurchaseMembership/components/MembershipEducation'
  )
);
const BuyAssets = lazy(() =>
  import(/* webpackChunkName: "BuyAssetsForm" */ '@features/BuyAssets/BuyAssetsForm')
);
const EnsDashboard = lazy(() =>
  import(/* webpackChunkName: "EnsDashboard" */ '@features/Ens/EnsDashboard')
);

export interface IAppRoutes {
  [K: string]: IAppRoute;
}

const DownloadAppRedirect = () => <Redirect to={ROUTE_PATHS.DOWNLOAD_DESKTOP_APP.path} />;

export const STATIC_APP_ROUTES: IAppRoute[] = [
  {
    name: ROUTE_PATHS.HOME.name,
    title: ROUTE_PATHS.HOME.title,
    path: ROUTE_PATHS.HOME.path,
    enabled: true,
    exact: true,
    seperateLayout: true,
    component: Home
  },
  {
    name: ROUTE_PATHS.DASHBOARD.name,
    title: ROUTE_PATHS.DASHBOARD.title,
    path: ROUTE_PATHS.DASHBOARD.path,
    enabled: IS_ACTIVE_FEATURE.DASHBOARD,
    exact: true,
    requireAccounts: true,
    component: Dashboard
  },
  {
    name: ROUTE_PATHS.ADD_ACCOUNT.name,
    title: ROUTE_PATHS.ADD_ACCOUNT.title,
    path: `${ROUTE_PATHS.ADD_ACCOUNT.path}/:walletId?`,
    enabled: IS_ACTIVE_FEATURE.ADD_ACCOUNT,
    exact: true,
    component: AddAccountFlow
  },
  {
    name: ROUTE_PATHS.CREATE_WALLET.name,
    title: ROUTE_PATHS.CREATE_WALLET.title,
    path: ROUTE_PATHS.CREATE_WALLET.path,
    enabled: IS_ACTIVE_FEATURE.CREATE_WALLET,
    exact: true,
    component: requiresDesktopApp(CreateWallet)(DownloadAppRedirect)
  },
  {
    name: ROUTE_PATHS.CREATE_WALLET_MNEMONIC.name,
    title: ROUTE_PATHS.CREATE_WALLET_MNEMONIC.title,
    path: ROUTE_PATHS.CREATE_WALLET_MNEMONIC.path,
    enabled: IS_ACTIVE_FEATURE.CREATE_WALLET,
    exact: true,
    component: requiresDesktopApp(Mnemonic)(DownloadAppRedirect)
  },
  {
    name: ROUTE_PATHS.CREATE_WALLET_KEYSTORE.name,
    title: ROUTE_PATHS.CREATE_WALLET_KEYSTORE.title,
    path: ROUTE_PATHS.CREATE_WALLET_KEYSTORE.path,
    enabled: IS_ACTIVE_FEATURE.CREATE_WALLET,
    exact: true,
    component: requiresDesktopApp(Keystore)(DownloadAppRedirect)
  },
  {
    name: ROUTE_PATHS.DOWNLOAD_DESKTOP_APP.name,
    title: ROUTE_PATHS.DOWNLOAD_DESKTOP_APP.title,
    path: ROUTE_PATHS.DOWNLOAD_DESKTOP_APP.path,
    enabled: IS_ACTIVE_FEATURE.DOWNLOAD_DESKTOP_APP,
    exact: true,
    component: DownloadApp
  },
  {
    name: ROUTE_PATHS.NO_ACCOUNTS.name,
    title: ROUTE_PATHS.NO_ACCOUNTS.title,
    path: ROUTE_PATHS.NO_ACCOUNTS.path,
    enabled: true,
    exact: true,
    component: NoAccounts
  },
  {
    name: ROUTE_PATHS.REQUEST_ASSETS.name,
    title: ROUTE_PATHS.REQUEST_ASSETS.title,
    path: ROUTE_PATHS.REQUEST_ASSETS.path,
    enabled: IS_ACTIVE_FEATURE.REQUEST_ASSETS,
    exact: true,
    requireAccounts: true,
    component: ReceiveAssets
  },
  {
    name: ROUTE_PATHS.SCREEN_LOCK_NEW.name,
    title: ROUTE_PATHS.SCREEN_LOCK_NEW.title,
    path: ROUTE_PATHS.SCREEN_LOCK_NEW.path,
    enabled: IS_ACTIVE_FEATURE.DASHBOARD,
    exact: true,
    component: ScreenLockNew
  },
  {
    name: ROUTE_PATHS.SCREEN_LOCK_LOCKED.name,
    title: ROUTE_PATHS.SCREEN_LOCK_LOCKED.title,
    path: ROUTE_PATHS.SCREEN_LOCK_LOCKED.path,
    enabled: IS_ACTIVE_FEATURE.SCREEN_LOCK,
    exact: true,
    component: ScreenLockLocked
  },
  {
    name: ROUTE_PATHS.SCREEN_LOCK_FORGOT.name,
    title: ROUTE_PATHS.SCREEN_LOCK_FORGOT.title,
    path: ROUTE_PATHS.SCREEN_LOCK_FORGOT.path,
    enabled: IS_ACTIVE_FEATURE.SCREEN_LOCK,
    exact: true,
    component: ScreenLockForgotPassword
  },
  {
    name: ROUTE_PATHS.SEND.name,
    title: ROUTE_PATHS.SEND.title,
    path: ROUTE_PATHS.SEND.path,
    enabled: IS_ACTIVE_FEATURE.SEND_ASSETS,
    exact: true,
    requireAccounts: true,
    component: SendAssets
  },
  {
    name: ROUTE_PATHS.SETTINGS.name,
    title: ROUTE_PATHS.SETTINGS.title,
    path: ROUTE_PATHS.SETTINGS.path,
    enabled: IS_ACTIVE_FEATURE.SETTINGS,
    exact: true,
    component: Settings
  },
  {
    name: ROUTE_PATHS.SETTINGS_IMPORT.name,
    title: ROUTE_PATHS.SETTINGS_IMPORT.title,
    path: ROUTE_PATHS.SETTINGS_IMPORT.path,
    enabled: IS_ACTIVE_FEATURE.SETTINGS,
    exact: true,
    component: Import
  },
  {
    name: ROUTE_PATHS.SETTINGS_EXPORT.name,
    title: ROUTE_PATHS.SETTINGS_EXPORT.title,
    path: ROUTE_PATHS.SETTINGS_EXPORT.path,
    enabled: IS_ACTIVE_FEATURE.SETTINGS,
    exact: true,
    component: Export
  },
  {
    name: ROUTE_PATHS.SWAP.name,
    title: ROUTE_PATHS.SWAP.title,
    path: ROUTE_PATHS.SWAP.path,
    enabled: IS_ACTIVE_FEATURE.SWAP,
    requireAccounts: true,
    exact: true,
    component: SwapAssetsFlow
  },
  {
    name: ROUTE_PATHS.SIGN_MESSAGE.name,
    title: ROUTE_PATHS.SIGN_MESSAGE.title,
    path: ROUTE_PATHS.SIGN_MESSAGE.path,
    enabled: IS_ACTIVE_FEATURE.SIGN_MESSAGE,
    exact: true,
    component: SignAndVerifyMessage
  },
  {
    name: ROUTE_PATHS.VERIFY_MESSAGE.name,
    title: ROUTE_PATHS.VERIFY_MESSAGE.title,
    path: ROUTE_PATHS.VERIFY_MESSAGE.path,
    enabled: IS_ACTIVE_FEATURE.VERIFY_MESSAGE,
    exact: true,
    component: SignAndVerifyMessage
  },
  {
    name: ROUTE_PATHS.BROADCAST_TX.name,
    title: ROUTE_PATHS.BROADCAST_TX.title,
    path: ROUTE_PATHS.BROADCAST_TX.path,
    enabled: IS_ACTIVE_FEATURE.BROADCAST_TX,
    component: BroadcastTransactionFlow
  },
  {
    name: ROUTE_PATHS.INTERACT_WITH_CONTRACTS.name,
    title: ROUTE_PATHS.INTERACT_WITH_CONTRACTS.title,
    path: ROUTE_PATHS.INTERACT_WITH_CONTRACTS.path,
    enabled: IS_ACTIVE_FEATURE.CONTRACT_INTERACT,
    component: InteractWithContractsFlow
  },
  {
    name: ROUTE_PATHS.DEPLOY_CONTRACTS.name,
    title: ROUTE_PATHS.DEPLOY_CONTRACTS.title,
    path: ROUTE_PATHS.DEPLOY_CONTRACTS.path,
    enabled: IS_ACTIVE_FEATURE.CONTRACT_DEPLOY,
    component: DeployContractsFlow
  },
  {
    name: ROUTE_PATHS.DEFIZAP.name,
    title: ROUTE_PATHS.DEFIZAP.title,
    path: `${ROUTE_PATHS.DEFIZAP.path}/:zapName?`,
    exact: true,
    requireAccounts: true,
    enabled: IS_ACTIVE_FEATURE.DEFIZAP,
    component: DeFiZapFlow
  },
  {
    name: ROUTE_PATHS.MYC_MEMBERSHIP.name,
    title: ROUTE_PATHS.MYC_MEMBERSHIP.title,
    path: ROUTE_PATHS.MYC_MEMBERSHIP.path,
    exact: true,
    requireAccounts: false,
    enabled: IS_ACTIVE_FEATURE.MYC_MEMBERSHIP,
    component: MembershipEducation
  },
  {
    name: ROUTE_PATHS.MYC_MEMBERSHIP_BUY.name,
    title: ROUTE_PATHS.MYC_MEMBERSHIP_BUY.title,
    path: `${ROUTE_PATHS.MYC_MEMBERSHIP_BUY.path}`,
    exact: true,
    requireAccounts: false,
    enabled: IS_ACTIVE_FEATURE.MYC_MEMBERSHIP,
    component: PurchaseMembershipStepper
  },
  {
    name: ROUTE_PATHS.BUY.name,
    title: ROUTE_PATHS.BUY.title,
    path: ROUTE_PATHS.BUY.path,
    exact: true,
    requireAccounts: false,
    enabled: IS_ACTIVE_FEATURE.BUY,
    component: BuyAssets
  },
  {
    name: ROUTE_PATHS.ENS.name,
    title: ROUTE_PATHS.ENS.title,
    path: ROUTE_PATHS.ENS.path,
    exact: true,
    requireAccounts: true,
    enabled: IS_ACTIVE_FEATURE.ENS,
    component: EnsDashboard
  }
];

// Enabled Routes
export const APP_ROUTES = STATIC_APP_ROUTES.filter((APP_ROUTE) => APP_ROUTE.enabled);

export const createAppRoutesObject = (paths: IAppRoute[]) => {
  return paths.reduce((navLinks, path) => {
    navLinks[path.name] = path;
    return navLinks;
  }, {} as IAppRoutes);
};

// APP_ROUTE_OBJECT is for ALL routes, even disabled ones.
export const APP_ROUTES_OBJECT = createAppRoutesObject(STATIC_APP_ROUTES);
