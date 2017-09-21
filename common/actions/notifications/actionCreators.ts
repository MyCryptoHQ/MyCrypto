import { ReactElement } from 'react';
import * as types from './actionTypes';
import * as constants from './constants';

export function showNotification(
  level: types.NOTIFICATION_LEVEL = 'info',
  msg: ReactElement<any> | string,
  duration?: number | types.INFINITY
): types.ShowNotificationAction {
  return {
    type: constants.SHOW_NOTIFICATION,
    payload: {
      level,
      msg,
      duration
    }
  };
}

export function closeNotification(
  notification: types.Notification
): types.CloseNotificationAction {
  return {
    type: constants.CLOSE_NOTIFICATION,
    payload: notification
  };
}
