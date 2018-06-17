import { delay, SagaIterator } from 'redux-saga';
import { call, put, takeEvery } from 'redux-saga/effects';

import * as types from './types';
import * as actions from './actions';

export function* handleNotification(action: types.ShowNotificationAction): SagaIterator {
  const { duration } = action.payload;
  // show forever
  if (duration === 0 || duration === Infinity) {
    return;
  }

  // FIXME
  yield call(delay, duration || 5000);
  yield put(actions.closeNotification(action.payload));
}

export function* notificationsSaga(): SagaIterator {
  yield takeEvery(types.NotificationsActions.SHOW, handleNotification);
}
