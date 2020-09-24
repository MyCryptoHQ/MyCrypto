import { useContext } from 'react';

import { ANALYTICS_CATEGORIES } from '@services';
import { DataContext } from '@services/Store';
import { ExtendedNotification, LSKeys } from '@types';
import { generateUUID, getTimeDifference, notUndefined, useAnalytics } from '@utils';

import { notificationsConfigs } from './constants';

export interface ProviderState {
  currentNotification: ExtendedNotification | undefined;
  notifications: ExtendedNotification[];
  displayNotification(templateName: string, templateData?: TObject): void;
  dismissCurrentNotification(): void;
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

  // Check conditions for repeating and non-repeating notifications, show notification if needed
  const shouldShowRepeatingNotification =
    config.repeatInterval &&
    n.dismissed &&
    config.repeatInterval <= getTimeDifference(n.dateDismissed ?? 0);
  const isNonrepeatingNotification = !config.repeatInterval && !n.dismissed;
  const isConfigCondition = config.condition && config.condition(n);

  return isConfigCondition && (shouldShowRepeatingNotification || isNonrepeatingNotification);
}

export function useNotifications() {
  const { notifications, createActions } = useContext(DataContext);
  const currentNotification = getCurrent(notifications);
  const Notification = createActions(LSKeys.NOTIFICATIONS);
  const trackNotificationDisplayed = useAnalytics({
    category: ANALYTICS_CATEGORIES.NOTIFICATION
  });

  const displayNotification = (templateName: string, templateData?: TObject) => {
    // Dismiss previous notifications that need to be dismissed
    if (!notificationsConfigs[templateName].preventDismisExisting) {
      notifications
        .filter((x) => notificationsConfigs[x.template].dismissOnOverwrite && !x.dismissed)
        .forEach(dismissNotification);
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

  const dismissNotification = (notif?: ExtendedNotification) => {
    if (notUndefined(notif)) {
      Notification.update(notif.uuid, {
        ...notif,
        dismissed: true,
        dateDismissed: new Date()
      });
    }
  };

  const dismissCurrentNotification = () => dismissNotification(currentNotification);

  const trackNotificationViewed = () => {
    if (currentNotification) {
      trackNotificationDisplayed({
        actionName: `${
          notificationsConfigs[currentNotification.template].analyticsEvent
        } notification displayed`
      });

      // Hide notifications that should be shown only once and update notifications that should be displayed again
      notifications.forEach((n) => {
        const config = notificationsConfigs[n.template];
        if (config.showOneTime && !n.dismissed && n.viewed) {
          dismissNotification(n);
        } else if (isValidNotification(n)) {
          Notification.update(n.uuid, {
            ...n,
            dismissed: false,
            dateDisplayed: new Date()
          });
        }
      });

      if (!currentNotification.viewed) {
        Notification.update(currentNotification.uuid, {
          ...currentNotification,
          viewed: true
        });
      }
    }
  };

  return {
    notifications,
    currentNotification,
    displayNotification,
    dismissNotification,
    dismissCurrentNotification,
    trackNotificationViewed
  };
}
