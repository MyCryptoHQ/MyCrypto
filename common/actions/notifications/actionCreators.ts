import { ReactElement } from 'react';
import * as types from './actionTypes';
import { TypeKeys } from './constants';

export type TShowNotification = typeof showNotification;
export function showNotification(
  level: types.NOTIFICATION_LEVEL = 'info',
  msg: ReactElement<any> | string,
  duration?: number
): types.ShowNotificationAction {
  return {
    type: TypeKeys.SHOW_NOTIFICATION,
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
    type: TypeKeys.CLOSE_NOTIFICATION,
    payload: notification
  };
}
