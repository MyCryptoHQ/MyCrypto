// @flow

/*** Shared types ***/
export type NOTIFICATION_LEVEL = 'danger' | 'warning' | 'success' | 'info';

export type Notification = {
  level: NOTIFICATION_LEVEL,
  msg: string,
  duration?: number
};

/*** Show Notification ***/
export type ShowNotificationAction = {
  type: 'SHOW_NOTIFICATION',
  payload: Notification
};

export function showNotification(
  level: NOTIFICATION_LEVEL = 'info',
  msg: string,
  duration?: number
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
export type CloseNotificationAction = {
  type: 'CLOSE_NOTIFICATION',
  payload: Notification
};

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
