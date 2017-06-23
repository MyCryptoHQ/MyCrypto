// @flow
import type {
    NotificationsAction,
    Notification,
    ShowNotificationAction,
    CloseNotificationAction
} from 'actions/notifications';

type State = Notification[];

const initialState: State = [];

function showNotification(state: State, action: ShowNotificationAction): State {
    return state.concat(action.payload);
}

function closeNotification(state, action: CloseNotificationAction): State {
    state = [...state];
    state.splice(state.indexOf(action.payload), 1);
    return state;
}

export function notifications(state: State = initialState, action: NotificationsAction): State {
    switch (action.type) {
        case 'SHOW_NOTIFICATION':
            return showNotification(state, action);
        case 'CLOSE_NOTIFICATION':
            return closeNotification(state, action);
        default:
            return state;
    }
}
