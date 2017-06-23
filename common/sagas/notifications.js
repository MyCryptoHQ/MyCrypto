// @flow
import { takeEvery, put, call } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { closeNotification } from 'actions/notifications';
import type { ShowNotificationAction } from 'actions/notifications';

function* handleNotification(action: ShowNotificationAction) {
    const { duration } = action.payload;
    // show forever
    if (duration === 0) {
        return;
    }

    // FIXME
    yield call(delay, duration || 5000);
    yield put(closeNotification(action.payload));
}

export default function* notificationsSaga() {
    yield takeEvery('SHOW_NOTIFICATION', handleNotification);
}
