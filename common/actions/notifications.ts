import { ReactElement } from 'react';

/*** Shared types ***/
export type NOTIFICATION_LEVEL = 'danger' | 'warning' | 'success' | 'info';
export type INFINITY = 'infinity';

export interface Notification {
  level: NOTIFICATION_LEVEL;
  msg: ReactElement<any> | string;
  duration?: number | INFINITY;
}

/*** Show Notification ***/
export interface ShowNotificationAction {
  type: 'SHOW_NOTIFICATION';
  payload: Notification;
}

export function showNotification(
  level: NOTIFICATION_LEVEL = 'info',
  msg: ReactElement<any> | string,
  duration?: number | INFINITY
): ShowNotificationAction {
  return {
    type: 'SHOW_NOTIFICATION',
    payload: {
      level,
      msg,
      duration
    }
  };
}

/*** Close notification ***/
export interface CloseNotificationAction {
  type: 'CLOSE_NOTIFICATION';
  payload: Notification;
}

export function closeNotification(
  notification: Notification
): CloseNotificationAction {
  return {
    type: 'CLOSE_NOTIFICATION',
    payload: notification
  };
}

/*** Union Type ***/
export type NotificationsAction =
  | ShowNotificationAction
  | CloseNotificationAction;
