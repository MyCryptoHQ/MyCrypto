import * as types from './types';

export const INITIAL_STATE: types.NotificationState = [];

function showNotification(
  state: types.NotificationState,
  action: types.ShowNotificationAction
): types.NotificationState {
  return state.concat(action.payload);
}

function closeNotification(
  state: types.NotificationState,
  action: types.CloseNotificationAction
): types.NotificationState {
  state = [...state];
  state.splice(state.indexOf(action.payload), 1);
  return state;
}

export function notificationsReducer(
  state: types.NotificationState = INITIAL_STATE,
  action: types.NotificationsAction
): types.NotificationState {
  switch (action.type) {
    case types.NotificationsActions.SHOW:
      return showNotification(state, action);
    case types.NotificationsActions.CLOSE:
      return closeNotification(state, action);
    default:
      return state;
  }
}
