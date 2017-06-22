// @flow

export type NOTIFICATION_LEVEL = 'danger' | 'warning' | 'success' | 'info';

export type Notification = {
    level: NOTIFICATION_LEVEL,
    msg: string,
    duration?: number
};

export type ShowNotificationAction = {
    type: 'SHOW_NOTIFICATION',
    payload: Notification
};

export type CloseNotificationAction = {
    type: 'CLOSE_NOTIFICATION',
    payload: Notification
};

export type NotificationsAction = ShowNotificationAction | CloseNotificationAction;

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

export function closeNotification(notification: Notification): CloseNotificationAction {
    return {
        type: 'CLOSE_NOTIFICATION',
        payload: notification
    };
}
