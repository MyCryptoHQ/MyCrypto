// @flow
import { takeEvery, put, call } from 'redux-saga/effects';
import { delay } from 'redux-saga';

import type { Yield, Return, Next } from 'sagas/types';

import { closeNotification } from 'actions/notifications';
import type { ShowNotificationAction } from 'actions/notifications';

function* handleNotification(
  action?: ShowNotificationAction
): Generator<Yield, Return, Next> {
  if (!action) return;
  const { duration } = action.payload;
  // show forever
  if (duration === 0 || duration === 'infinity') {
    return;
  }

  // FIXME
  yield call(delay, duration || 5000);
  yield put(closeNotification(action.payload));
}

export default function* notificationsSaga(): Generator<Yield, Return, Next> {
  yield takeEvery('SHOW_NOTIFICATION', handleNotification);
}
