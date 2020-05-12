import {
  saveSettingsCheck,
  printPaperWalletCheck,
  getHardwareWalletCheck,
  onboardingPleaseUnderstandCheck,
  onboardingResponsibleCheck
} from './helpers';
import { NotificationsConfigsProps } from './types';
import {
  WalletCreatedNotification,
  WalletAddedNotification,
  SaveDashboardNotification,
  PrintPaperWalletNotification,
  GetHardwareWalletNotification,
  WalletNotAddedNotification,
  OnboardingPleaseUnderstandNotification,
  OnboardingResponsibleNotification,
  UnlockVIPNotification
} from './components';

export const NotificationTemplates = {
  walletCreated: 'wallet-created',
  walletAdded: 'wallet-added',
  walletNotAdded: 'wallet-not-added',
  saveSettings: 'save-settings',
  printPaperWallet: 'print-paper-wallet',
  getHardwareWallet: 'get-hardware-wallet',
  onboardingPleaseUnderstand: 'onboarding-please-understand',
  onboardingResponsible: 'onboarding-responsible',
  unlockVIPDetected: 'unlock-vip-detected'
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
  [NotificationTemplates.walletNotAdded]: {
    analyticsEvent: 'New Account (Wallet) Could Not Be Added',
    layout: WalletNotAddedNotification,
    showOneTime: true,
    dismissOnOverwrite: true
  },
  [NotificationTemplates.saveSettings]: {
    analyticsEvent: 'Save Your Dashboard Settings',
    layout: SaveDashboardNotification,
    repeatInterval: 15778463,
    condition: saveSettingsCheck
  },
  [NotificationTemplates.printPaperWallet]: {
    analyticsEvent: 'Print Your Paper Wallet',
    layout: PrintPaperWalletNotification,
    repeatInterval: 15778463,
    condition: printPaperWalletCheck
  },
  [NotificationTemplates.getHardwareWallet]: {
    analyticsEvent: 'Get a Hardware Wallet',
    layout: GetHardwareWalletNotification,
    dismissForever: true,
    condition: getHardwareWalletCheck
  },
  [NotificationTemplates.onboardingPleaseUnderstand]: {
    analyticsEvent: 'Onboarding Please Understand',
    layout: OnboardingPleaseUnderstandNotification,
    dismissForever: true,
    condition: onboardingPleaseUnderstandCheck,
    preventDismisExisting: true
  },
  [NotificationTemplates.onboardingResponsible]: {
    analyticsEvent: 'Onboarding Responsible',
    layout: OnboardingResponsibleNotification,
    dismissForever: true,
    condition: onboardingResponsibleCheck,
    preventDismisExisting: true
  },
  [NotificationTemplates.unlockVIPDetected]: {
    analyticsEvent: 'UnlockVIP Detected',
    layout: UnlockVIPNotification,
    showOneTime: true,
    dismissOnOverwrite: true
  }
};
