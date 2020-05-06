import React, { createContext, useContext, useEffect, useState } from 'react';
import moment from 'moment';

import { DataContext } from 'v2/services/Store';
import { ExtendedNotification, LSKeys } from 'v2/types';
import { AnalyticsService, ANALYTICS_CATEGORIES } from 'v2/services';
import { generateUUID, notUndefined } from 'v2/utils';
import { notificationsConfigs } from './constants';

export interface ProviderState {
  currentNotification: ExtendedNotification | undefined;
  notifications: ExtendedNotification[];
  displayNotification(templateName: string, templateData?: object): void;
  dismissCurrentNotification(): void;
}

export const NotificationsContext = createContext({} as ProviderState);

function trackNotificationDisplayed(event: string) {
  AnalyticsService.instance.track(
    ANALYTICS_CATEGORIES.NOTIFICATION,
    `${event} notification displayed`
  );
}

function getCurrent(notifications: ExtendedNotification[]) {
  const visible = notifications
    .sort((a, b) => {
      return new Date(a.dateDisplayed).getTime() - new Date(b.dateDisplayed).getTime();
    })
    .filter((x) => {
      return (
        !x.dismissed &&
        (notificationsConfigs[x.template].condition
          ? notificationsConfigs[x.template].condition!(x)
          : true)
      );
    });
  return visible[visible.length - 1];
}

function isValidNotification(n: ExtendedNotification) {
  const config = notificationsConfigs[n.template];
  // if (config.showOneTime) {
  //   state.dismissNotification(n);
  //   return;
  // }

  // Check conditions for repeating and non-repeating notifications, show notification if needed
  const shouldShowRepeatingNotification =
    config.repeatInterval &&
    n.dismissed &&
    config.repeatInterval <=
      moment.duration(moment(new Date()).diff(moment(n.dateDismissed))).asSeconds();
  const isNonrepeatingNotification = !config.repeatInterval && !n.dismissed;
  const isConfigCondition = config.condition && config.condition(n);

  return isConfigCondition && (shouldShowRepeatingNotification || isNonrepeatingNotification);
}

export const NotificationsProvider: React.FC = ({ children }) => {
  const { notifications, createActions } = useContext(DataContext);
  const [currentNotification, setCurrentNotification] = useState<ExtendedNotification>();
  const Notification = createActions(LSKeys.NOTIFICATIONS);

  useEffect(() => {
    notifications.filter(isValidNotification).forEach((n) =>
      Notification.update(n.uuid, {
        ...n,
        dismissed: false,
        dateDisplayed: new Date()
      })
    );
  }, []);

  useEffect(() => {
    const current = getCurrent(notifications);
    setCurrentNotification(current);
    if (current) {
      trackNotificationDisplayed(notificationsConfigs[current.template].analyticsEvent);
    }
  }, [notifications]);

  const displayNotification = (templateName: string, templateData?: object) => {
    // Dismiss previous notifications that need to be dismissed
    if (!notificationsConfigs[templateName].preventDismisExisting) {
      notifications
        .filter((x) => notificationsConfigs[x.template].dismissOnOverwrite && !x.dismissed)
        .forEach(state.dismissNotification);
    }

    // Create the notification object
    const notification: ExtendedNotification = {
      uuid: generateUUID(),
      template: templateName,
      templateData,
      dateDisplayed: new Date(),
      dismissed: false,
      dateDismissed: undefined
    };

    // If notification with this template already exists update it,
    // otherwise create a new one
    const existingNotification = notifications.find((x) => x.template === notification.template);

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

      Notification.update(existingNotification.uuid, notification);
    } else {
      Notification.createWithID(notification, notification.uuid);
    }
  };

  const state = {
    notifications,
    currentNotification,
    displayNotification,
    dismissNotification: (notif?: ExtendedNotification) => {
      if (notUndefined(notif)) {
        Notification.update(notif.uuid, {
          ...notif,
          dismissed: true,
          dateDismissed: new Date()
        });
      }
    },
    dismissCurrentNotification: () => state.dismissNotification(currentNotification)
  };
  return <NotificationsContext.Provider value={state}>{children}</NotificationsContext.Provider>;
};
