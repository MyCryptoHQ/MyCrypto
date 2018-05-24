import { ReactElement } from 'react';

export type NotificationState = Notification[];

export enum NOTIFICATIONS {
  SHOW = 'NOTIFICATIONS_SHOW',
  CLOSE = 'NOTIFICATIONS_CLOSE'
}

/*** Shared types ***/
export type NOTIFICATION_LEVEL = 'danger' | 'warning' | 'success' | 'info';

export interface Notification {
  level: NOTIFICATION_LEVEL;
  msg: ReactElement<any> | string;
  id: number;
  duration?: number;
}

/*** Close notification ***/
export interface CloseNotificationAction {
  type: NOTIFICATIONS.CLOSE;
  payload: Notification;
}

/*** Show Notification ***/
export interface ShowNotificationAction {
  type: NOTIFICATIONS.SHOW;
  payload: Notification;
}

/*** Union Type ***/
export type NotificationsAction = ShowNotificationAction | CloseNotificationAction;
