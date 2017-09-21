import { ReactElement } from 'react';

/*** Shared types ***/
export type NOTIFICATION_LEVEL = 'danger' | 'warning' | 'success' | 'info';
export type INFINITY = 'infinity';

export interface Notification {
  level: NOTIFICATION_LEVEL;
  msg: ReactElement<any> | string;
  duration?: number | INFINITY;
}

/*** Close notification ***/
export interface CloseNotificationAction {
  type: 'CLOSE_NOTIFICATION';
  payload: Notification;
}

/*** Show Notification ***/
export interface ShowNotificationAction {
  type: 'SHOW_NOTIFICATION';
  payload: Notification;
}

/*** Union Type ***/
export type NotificationsAction =
  | ShowNotificationAction
  | CloseNotificationAction;
