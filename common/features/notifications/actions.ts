import { ReactElement } from 'react';
import {
  NOTIFICATIONS,
  NOTIFICATION_LEVEL,
  Notification,
  CloseNotificationAction,
  ShowNotificationAction
} from './types';

export type TShowNotification = typeof showNotification;
export function showNotification(
  level: NOTIFICATION_LEVEL = 'info',
  msg: ReactElement<any> | string,
  duration?: number
): ShowNotificationAction {
  return {
    type: NOTIFICATIONS.SHOW,
    payload: {
      level,
      msg,
      duration,
      id: Math.random()
    }
  };
}

export type TCloseNotification = typeof closeNotification;
export function closeNotification(notification: Notification): CloseNotificationAction {
  return {
    type: NOTIFICATIONS.CLOSE,
    payload: notification
  };
}

export default {
  showNotification,
  closeNotification
};
