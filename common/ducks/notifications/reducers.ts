import {
  TypeKeys,
  CloseNotificationAction,
  Notification,
  NotificationsAction,
  ShowNotificationAction
} from './types';
export type State = Notification[];

export const INITIAL_STATE: State = [];

function showNotification(state: State, action: ShowNotificationAction): State {
  return state.concat(action.payload);
}

function closeNotification(state: State, action: CloseNotificationAction): State {
  state = [...state];
  state.splice(state.indexOf(action.payload), 1);
  return state;
}

export default function notifications(
  state: State = INITIAL_STATE,
  action: NotificationsAction
): State {
  switch (action.type) {
    case TypeKeys.SHOW_NOTIFICATION:
      return showNotification(state, action);
    case TypeKeys.CLOSE_NOTIFICATION:
      return closeNotification(state, action);
    default:
      return state;
  }
}
