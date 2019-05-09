import { saveSettingsCheck, printPaperWalletCheck, getHardwareWalletCheck } from './helpers';
import { NotificationsConfigsProps } from './types';
import {
  WalletCreatedNotification,
  WalletAddedNotification,
  SaveDashboardNotification,
  PrintPaperWalletNotification,
  GetHardwareWalletNotification
} from 'v2/features/Dashboard/NotificationsPanel/components';

export const NotificationTemplates = {
  walletCreated: 'wallet-created',
  walletAdded: 'wallet-added',
  saveSettings: 'save-settings',
  printPaperWallet: 'print-paper-wallet',
  getHardwareWallet: 'get-hardware-wallet'
};

export const notificationsConfigs: NotificationsConfigsProps = {
  [NotificationTemplates.walletCreated]: {
    analyticsEvent: 'New Account (Wallet) Created',
    layout: WalletCreatedNotification,
    showOneTime: true,
    dismissOnOverwrite: true
  },
  [NotificationTemplates.walletAdded]: {
    analyticsEvent: 'New Account (Wallet) Added',
    layout: WalletAddedNotification,
    showOneTime: true,
    dismissOnOverwrite: true
  },
  [NotificationTemplates.saveSettings]: {
    analyticsEvent: 'Save Your Dashboard Settings',
    layout: SaveDashboardNotification,
    showOneTime: false,
    dismissOnOverwrite: false,
    repeatInterval: 60,
    condition: saveSettingsCheck
  },
  [NotificationTemplates.printPaperWallet]: {
    analyticsEvent: 'Print Your Paper Wallet',
    layout: PrintPaperWalletNotification,
    showOneTime: false,
    dismissOnOverwrite: false,
    repeatInterval: 60,
    condition: printPaperWalletCheck
  },
  [NotificationTemplates.getHardwareWallet]: {
    analyticsEvent: 'Get a Hardware Wallet',
    layout: GetHardwareWalletNotification,
    showOneTime: false,
    dismissOnOverwrite: false,
    dismissForever: true,
    condition: getHardwareWalletCheck
  }
};
