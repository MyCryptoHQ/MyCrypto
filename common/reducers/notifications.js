// @flow
import type { NotificationsAction, Notification } from 'actions/notifications';

type State = Notification[];

const initialState: State = [];

export function notifications(state: State = initialState, action: NotificationsAction): State {
    switch (action.type) {
        case 'SHOW_NOTIFICATION':
            return state.concat(action.payload);
        case 'CLOSE_NOTIFICATION':
            state = [...state]
            state.splice(state.indexOf(action.payload), 1);
            return state
        default:
            return state;
    }
}
