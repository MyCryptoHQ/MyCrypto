export interface Notification {
  template: string;
  options: NotificationOptions;
  dateDisplayed: Date;
  dismissed: boolean;
  dateDismissed: Date | undefined;
}

export interface ExtendedNotification extends Notification {
  uuid: string;
}

export interface NotificationOptions {
  showOneTime?: boolean;
  dismissOnOverwrite?: boolean;
  repeating?: boolean;
  templateData?: { [key: string]: any };
}

export enum NotificationTemplates {
  walletCreated = 'wallet-created',
  walletAdded = 'wallet-added',
  saveSettings = 'save-settings',
  printPaperWallet = 'print-paper-wallet',
  getHardwareWallet = 'get-hardware-wallet'
}
