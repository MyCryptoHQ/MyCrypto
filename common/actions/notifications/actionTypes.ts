import { ReactElement } from 'react';
import { TypeKeys } from './constants';
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
  type: TypeKeys.CLOSE_NOTIFICATION;
  payload: Notification;
}

/*** Show Notification ***/
export interface ShowNotificationAction {
  type: TypeKeys.SHOW_NOTIFICATION;
  payload: Notification;
}

/*** Union Type ***/
export type NotificationsAction = ShowNotificationAction | CloseNotificationAction;
