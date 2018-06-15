import { delay, SagaIterator } from 'redux-saga';
import { call, put, takeEvery } from 'redux-saga/effects';

import * as notificationsTypes from './types';
import * as notificationsActions from './actions';

export function* handleNotification(
  action: notificationsTypes.ShowNotificationAction
): SagaIterator {
  const { duration } = action.payload;
  // show forever
  if (duration === 0 || duration === Infinity) {
    return;
  }

  // FIXME
  yield call(delay, duration || 5000);
  yield put(notificationsActions.closeNotification(action.payload));
}

export function* notificationsSaga(): SagaIterator {
  yield takeEvery(notificationsTypes.NotificationsActions.SHOW, handleNotification);
}
