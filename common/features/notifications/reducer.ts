import {
  NOTIFICATIONS,
  CloseNotificationAction,
  NotificationsAction,
  ShowNotificationAction,
  NotificationState
} from './types';

export const INITIAL_STATE: NotificationState = [];

function showNotification(
  state: NotificationState,
  action: ShowNotificationAction
): NotificationState {
  return state.concat(action.payload);
}

function closeNotification(
  state: NotificationState,
  action: CloseNotificationAction
): NotificationState {
  state = [...state];
  state.splice(state.indexOf(action.payload), 1);
  return state;
}

export function notificationsReducer(
  state: NotificationState = INITIAL_STATE,
  action: NotificationsAction
): NotificationState {
  switch (action.type) {
    case NOTIFICATIONS.SHOW:
      return showNotification(state, action);
    case NOTIFICATIONS.CLOSE:
      return closeNotification(state, action);
    default:
      return state;
  }
}
