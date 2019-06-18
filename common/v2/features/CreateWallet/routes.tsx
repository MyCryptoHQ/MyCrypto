import React, { ComponentType } from 'react';
import { Redirect } from 'react-router-dom';

import { isDesktop } from 'v2/utils';
import CreateWallet from './CreateWallet';
import { Mnemonic } from './Mnemonic';
import { Keystore } from './Keystore';

const DownloadAppRedirect = () => <Redirect to="/download-desktop-app" />;
const requiresDesktopApp = (component: ComponentType): ComponentType =>
  !isDesktop() ? component : DownloadAppRedirect;

export default [
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
  }
];
