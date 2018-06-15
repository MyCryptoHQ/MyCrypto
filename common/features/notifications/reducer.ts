import * as notificationTypes from './types';

export const INITIAL_STATE: notificationTypes.NotificationState = [];

function showNotification(
  state: notificationTypes.NotificationState,
  action: notificationTypes.ShowNotificationAction
): notificationTypes.NotificationState {
  return state.concat(action.payload);
}

function closeNotification(
  state: notificationTypes.NotificationState,
  action: notificationTypes.CloseNotificationAction
): notificationTypes.NotificationState {
  state = [...state];
  state.splice(state.indexOf(action.payload), 1);
  return state;
}

export function notificationsReducer(
  state: notificationTypes.NotificationState = INITIAL_STATE,
  action: notificationTypes.NotificationsAction
): notificationTypes.NotificationState {
  switch (action.type) {
    case notificationTypes.NotificationsActions.SHOW:
      return showNotification(state, action);
    case notificationTypes.NotificationsActions.CLOSE:
      return closeNotification(state, action);
    default:
      return state;
  }
}
