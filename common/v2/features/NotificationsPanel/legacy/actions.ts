import * as types from './types';

export type TShowNotification = typeof showNotification;
export function showNotification(
  level: types.NotificationLevel = 'info',
  msg: string,
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

export type TShowNotificationWithComponent = typeof showNotificationWithComponent;
export function showNotificationWithComponent(
  level: types.NotificationLevel,
  msg: string,
  componentConfig: {
    component: string;
    [restProp: string]: any;
  },
  duration?: number
): types.ShowNotificationAction {
  return {
    type: types.NotificationsActions.SHOW,
    payload: {
      id: Math.random(),
      level,
      msg,
      rendersComponent: true,
      componentConfig,
      duration
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
