import React, { Component, createContext } from 'react';
import moment from 'moment';

import * as service from 'v2/services/Notifications/Notifications';
import { ExtendedNotification, Notification } from 'v2/services/Notifications';
import { AnalyticsService, ANALYTICS_CATEGORIES } from 'v2/services';
import { notificationsConfigs } from './constants';

export interface ProviderState {
  currentNotification: ExtendedNotification | undefined;
  notifications: ExtendedNotification[];
  displayNotification(templateName: string, templateData?: object): void;
  dismissCurrentNotification(): void;
}

export const NotificationsContext = createContext({} as ProviderState);

export class NotificationsProvider extends Component {
  public state: ProviderState = {
    currentNotification: undefined,
    notifications: service.readAllNotifications() || [],
    displayNotification: (templateName: string, templateData?: object) =>
      this.displayNotification(templateName, templateData),
    dismissCurrentNotification: () => this.dismissCurrentNotification()
  };

  public componentDidMount() {
    this.checkConditions();
    this.getNotifications();
  }

  public render() {
    const { children } = this.props;
    return (
      <NotificationsContext.Provider value={this.state}>{children}</NotificationsContext.Provider>
    );
  }

  private displayNotification = (templateName: string, templateData?: object) => {
    // Dismiss previous notifications that need to be dismissed
    if (!notificationsConfigs[templateName].preventDismisExisting) {
      const notificationsToDismiss = this.state.notifications.filter(
        x => notificationsConfigs[x.template].dismissOnOverwrite && !x.dismissed
      );
      notificationsToDismiss.forEach(dismissableNotification => {
        this.dismissNotification(dismissableNotification);
      });
    }

    // Create the notification object
    const notification: Notification = {
      template: templateName,
      templateData,
      dateDisplayed: new Date(),
      dismissed: false,
      dateDismissed: undefined
    };

    // If notification with this template already exists update it, otherwise create a new one
    const existingNotification = this.state.notifications.find(
      x => x.template === notification.template
    );

    if (existingNotification) {
      /* Prevent displaying notifications that have been dismissed forever and repeating notifications
         before their waiting period is over.*/
      if (
        notificationsConfigs[templateName].repeatInterval ||
        notificationsConfigs[templateName].dismissForever
      ) {
        notification.dismissed = existingNotification.dismissed;
        notification.dateDismissed = existingNotification.dateDismissed;
      }

      service.updateNotification(existingNotification.uuid, notification);
    } else {
      service.createNotification(notification);
    }

    this.getNotifications();
  };

  private dismissCurrentNotification = () => {
    const notification = this.state.currentNotification;
    if (notification) {
      this.dismissNotification(notification);
      this.getNotifications();
    }
  };

  private dismissNotification = (notification: ExtendedNotification) => {
    notification.dismissed = true;
    notification.dateDismissed = new Date();
    service.updateNotification(notification.uuid, notification);
  };

  private checkConditions = () => {
    this.state.notifications.forEach(notification => {
      const notificationConfig = notificationsConfigs[notification.template];

      // Dismiss one-time notifications
      if (notificationConfig.showOneTime) {
        this.dismissNotification(notification);
        return;
      }

      // Check conditions for repeating and non-repeating notifications, show notification if needed
      const shouldShowRepeatingNotification =
        notificationConfig.repeatInterval &&
        notification.dismissed &&
        notificationConfig.repeatInterval <=
          moment.duration(moment(new Date()).diff(moment(notification.dateDismissed))).asSeconds();

      const isNonrepeatingNotification =
        !notificationConfig.repeatInterval && !notification.dismissed;

      // Return if there is a condition and it is not met
      if (shouldShowRepeatingNotification || isNonrepeatingNotification) {
        if (notificationConfig.condition && !notificationConfig.condition(notification)) {
          return;
        }
        notification.dismissed = false;
        notification.dateDisplayed = new Date();
        service.updateNotification(notification.uuid, notification);
      }
    });
  };

  private getNotifications = () => {
    const notifications: ExtendedNotification[] = service.readAllNotifications() || [];

    this.setState({ notifications });
    const sortedNotifications = notifications.sort((a, b) => {
      return new Date(a.dateDisplayed).getTime() - new Date(b.dateDisplayed).getTime();
    });
    const visibleNotifications = sortedNotifications.filter(
      x =>
        !x.dismissed &&
        (notificationsConfigs[x.template].condition
          ? notificationsConfigs[x.template].condition!(x)
          : true)
    );

    const currentNotification = visibleNotifications[visibleNotifications.length - 1];
    this.setState({ currentNotification });

    // Track notification displayed event if there is current notification
    if (currentNotification) {
      this.trackNotificationDisplayed(
        notificationsConfigs[currentNotification.template].analyticsEvent
      );
    }
  };

  private trackNotificationDisplayed = (notification: string) => {
    AnalyticsService.instance.track(
      ANALYTICS_CATEGORIES.NOTIFICATION,
      `${notification} notification displayed`
    );
  };
}
