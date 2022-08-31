import { TUuid } from './uuid';

export interface Notification {
  template: string;
  templateData?: { [key: string]: any };
  dateDisplayed: Date;
  dismissed: boolean;
  dateDismissed: Date | undefined;
  viewed?: boolean;
}

export interface ExtendedNotification extends Notification {
  uuid: TUuid;
}

export const NotificationTemplates = {
  walletCreated: 'wallet-created',
  walletAdded: 'wallet-added',
  walletsAdded: 'wallets-added',
  walletNotAdded: 'wallet-not-added',
  walletsNotAdded: 'wallets-not-added',
  saveSettings: 'save-settings',
  getHardwareWallet: 'get-hardware-wallet',
  onboardingPleaseUnderstand: 'onboarding-please-understand',
  onboardingResponsible: 'onboarding-responsible',
  winterPoap: 'winter-poap'
};
