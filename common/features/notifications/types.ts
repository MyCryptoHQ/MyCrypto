export type NotificationState = Notification[];

export enum NotificationsActions {
  SHOW = 'SHOW_NOTIFICATION',
  CLOSE = 'CLOSE_NOTIFICATION'
}

/*** Shared types ***/
export type NotificationLevel = 'danger' | 'warning' | 'success' | 'info';

export interface Notification {
  level: NotificationLevel;
  msg?: string;
  id: number;
  duration?: number;

  // Note: This is a temporary fix to avoid a circular dependency.

  rendersComponent?: boolean;
  componentConfig?: {
    component: string;
    [restProp: string]: any;
  };
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
