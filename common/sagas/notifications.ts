import { closeNotification, ShowNotificationAction } from 'actions/notifications';
import { delay, SagaIterator } from 'redux-saga';
import { call, put, takeEvery } from 'redux-saga/effects';

export function* handleNotification(action: ShowNotificationAction): SagaIterator {
  const { duration } = action.payload;
  // show forever
  if (duration === 0 || duration === Infinity) {
    return;
  }

  // FIXME
  yield call(delay, duration || 5000);
  yield put(closeNotification(action.payload));
}

export default function* notificationsSaga(): SagaIterator {
  yield takeEvery('SHOW_NOTIFICATION', handleNotification);
}
