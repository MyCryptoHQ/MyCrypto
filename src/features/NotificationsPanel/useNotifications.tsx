import { useContext, useEffect, useState } from 'react';
import moment from 'moment';

import { DataContext } from '@services/Store';
import { AnalyticsService, ANALYTICS_CATEGORIES } from '@services';
import { ExtendedNotification, LSKeys } from '@types';
import { generateUUID, notUndefined } from '@utils';
import { notificationsConfigs } from './constants';

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

const useNotifications = () => {
  const { notifications, createActions } = useContext(DataContext);
  const Notification = createActions(LSKeys.NOTIFICATIONS);
  const [currentNotification, setCurrentNotification] = useState<ExtendedNotification>();

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

  return {
    notifications,
    currentNotification,
    displayNotification,
    dismissCurrentNotification
  };
};

export default useNotifications;
