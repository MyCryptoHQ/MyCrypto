import React, { Component, createContext } from 'react';

import * as service from 'v2/services/Notifications/Notifications';
import {
  ExtendedNotification,
  Notification,
  NotificationOptions,
  NotificationTemplates
} from 'v2/services/Notifications';
import { AnalyticsService, ANALYTICS_CATEGORIES } from 'v2/services';

const {
  walletCreated,
  walletAdded,
  saveSettings,
  printPaperWallet,
  getHardwareWallet
} = NotificationTemplates;

interface NotificationsStringsProps {
  [key: string]: string;
}

const notificationsStrings: NotificationsStringsProps = {
  [walletCreated]: 'New Account (Wallet) Created',
  [walletAdded]: 'New Account (Wallet) Added',
  [saveSettings]: 'Save Your Dashboard Settings',
  [printPaperWallet]: 'Print Your Paper Wallet',
  [getHardwareWallet]: 'Get a Hardware Wallet'
};

export interface ProviderState {
  currentNotification: ExtendedNotification | undefined;
  notifications: ExtendedNotification[];
  createNotification(
    templateName: string,
    templateData?: object,
    options?: NotificationOptions
  ): void;
  dismissCurrentNotification(): void;
}

export const NotificationsContext = createContext({} as ProviderState);

export class NotificationsProvider extends Component {
  public state: ProviderState = {
    currentNotification: undefined,
    notifications: service.readAllNotifications() || [],
    createNotification: (templateName: NotificationTemplates, options?: NotificationOptions) =>
      this.createNotification(templateName, options),
    dismissCurrentNotification: () => this.dismissCurrentNotification()
  };

  public createNotification = (
    templateName: NotificationTemplates,
    options?: NotificationOptions
  ) => {
    // Dismiss old notifications that need to be dismissed
    const notificationsToDismiss = this.state.notifications.filter(
      x => x.options.dismissOnOverwrite === true && x.dismissed === false
    );
    notificationsToDismiss.forEach(dismissableNotification => {
      this.dismissNotification(dismissableNotification);
    });

    // Apply notification options
    const defaultNotificationOptions: NotificationOptions = {
      showOneTime: false,
      dismissOnOverwrite: true,
      repeating: false,
      templateData: {}
    };
    const notificationOptions = Object.assign(defaultNotificationOptions, options);

    // Create the notification object
    const notification: Notification = {
      template: templateName,
      options: notificationOptions,
      dateDisplayed: new Date(),
      dismissed: false,
      dateDismissed: undefined
    };

    // If notification already exists update it, otherwise create a new one
    const existingNotification = this.state.notifications.find(
      x => x.template === notification.template
    );

    if (existingNotification) {
      service.updateNotification(existingNotification.uuid, notification);
    } else {
      service.createNotification(notification);
    }

    // track notification displayed event
    this.trackNotificationDisplayed(notificationsStrings[templateName]);

    this.getNotifications();
  };

  public dismissCurrentNotification = () => {
    const notification = this.state.currentNotification;
    if (notification) {
      this.dismissNotification(notification);
      this.getNotifications();
    }
  };

  public dismissNotification = (notification: ExtendedNotification) => {
    notification.dismissed = true;
    notification.dateDismissed = new Date();
    service.updateNotification(notification.uuid, notification);
  };

  public render() {
    const { children } = this.props;
    return (
      <NotificationsContext.Provider value={this.state}>{children}</NotificationsContext.Provider>
    );
  }

  private getNotifications = () => {
    const notifications: ExtendedNotification[] = service.readAllNotifications() || [];

    this.setState({ notifications });
    const sortedNotifications = notifications.sort((a, b) => {
      return new Date(a.dateDisplayed).getTime() - new Date(b.dateDisplayed).getTime();
    });
    const visibleNotifications = sortedNotifications.filter(x => !x.dismissed);

    this.setState({ currentNotification: visibleNotifications[visibleNotifications.length - 1] });
  };

  private trackNotificationDisplayed = (notification: string) => {
    AnalyticsService.instance.track(
      ANALYTICS_CATEGORIES.NOTIFICATION,
      `${notification} notification displayed`
    );
  };
}
