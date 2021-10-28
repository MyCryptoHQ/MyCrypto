import halloweenBg from '@assets/images/halloween-bg.svg';
import { NotificationTemplates } from '@types';

import {
  GetHardwareWalletNotification,
  HalloweenNotification,
  OnboardingPleaseUnderstandNotification,
  OnboardingResponsibleNotification,
  SaveDashboardNotification,
  WalletAddedNotification,
  WalletCreatedNotification,
  WalletNotAddedNotification,
  WalletsAddedNotification,
  WalletsNotAddedNotification
} from './components';
import {
  getHardwareWalletCheck,
  halloweenCheck,
  onboardingPleaseUnderstandCheck,
  onboardingResponsibleCheck,
  saveSettingsCheck
} from './helpers';
import { NotificationsConfigsProps } from './types';

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
  [NotificationTemplates.walletsAdded]: {
    analyticsEvent: 'New Accounts Added',
    layout: WalletsAddedNotification,
    showOneTime: true,
    dismissOnOverwrite: true
  },
  [NotificationTemplates.walletNotAdded]: {
    analyticsEvent: 'New Account (Wallet) Could Not Be Added',
    layout: WalletNotAddedNotification,
    showOneTime: true,
    dismissOnOverwrite: true
  },
  [NotificationTemplates.walletsNotAdded]: {
    analyticsEvent: 'New Account (Wallet) Could Not Be Added',
    layout: WalletsNotAddedNotification,
    showOneTime: true,
    dismissOnOverwrite: true
  },
  [NotificationTemplates.saveSettings]: {
    analyticsEvent: 'Save Your Dashboard Settings',
    layout: SaveDashboardNotification,
    repeatInterval: 86400,
    condition: saveSettingsCheck
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
  [NotificationTemplates.halloweenPoap]: {
    analyticsEvent: 'Halloween Poap',
    layout: HalloweenNotification,
    condition: halloweenCheck,
    priority: true,
    style: (isMobile) => ({
      backgroundImage: `url(${halloweenBg})`,
      backgroundSize: isMobile ? 'cover' : '100% 100%'
    })
  }
};
