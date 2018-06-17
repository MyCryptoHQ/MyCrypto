import { ReactElement } from 'react';
import * as types from './types';

export type TShowNotification = typeof showNotification;
export function showNotification(
  level: types.NotificationLevel = 'info',
  msg: ReactElement<any> | string,
  duration?: number
): types.ShowNotificationAction {
  return {
    type: types.NotificationsActions.SHOW,
    payload: {
      level,
      msg,
      duration,
      id: Math.random()
    }
  };
}

export type TCloseNotification = typeof closeNotification;
export function closeNotification(notification: types.Notification): types.CloseNotificationAction {
  return {
    type: types.NotificationsActions.CLOSE,
    payload: notification
  };
}
