import { ReactElement } from 'react';

export type NotificationState = Notification[];

export enum NotificationsActions {
  SHOW = 'SHOW_NOTIFICATION',
  CLOSE = 'CLOSE_NOTIFICATION'
}

/*** Shared types ***/
export type NotificationLevel = 'danger' | 'warning' | 'success' | 'info';

export interface Notification {
  level: NotificationLevel;
  msg: ReactElement<any> | string;
  id: number;
  duration?: number;
}

/*** Close notification ***/
export interface CloseNotificationAction {
  type: NotificationsActions.CLOSE;
  payload: Notification;
}

/*** Show Notification ***/
export interface ShowNotificationAction {
  type: NotificationsActions.SHOW;
  payload: Notification;
}

/*** Union Type ***/
export type NotificationsAction = ShowNotificationAction | CloseNotificationAction;
