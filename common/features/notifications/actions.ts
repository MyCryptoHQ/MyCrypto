import { ReactElement } from 'react';
import * as notificationsTypes from './types';

export type TShowNotification = typeof showNotification;
export function showNotification(
  level: notificationsTypes.NotificationLevel = 'info',
  msg: ReactElement<any> | string,
  duration?: number
): notificationsTypes.ShowNotificationAction {
  return {
    type: notificationsTypes.NotificationsActions.SHOW,
    payload: {
      level,
      msg,
      duration,
      id: Math.random()
    }
  };
}

export type TCloseNotification = typeof closeNotification;
export function closeNotification(
  notification: notificationsTypes.Notification
): notificationsTypes.CloseNotificationAction {
  return {
    type: notificationsTypes.NotificationsActions.CLOSE,
    payload: notification
  };
}
