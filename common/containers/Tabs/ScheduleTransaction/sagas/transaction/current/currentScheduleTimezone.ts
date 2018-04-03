import { setScheduleTimezone } from 'actions/transaction/actionCreators/fields';
import { call, put, takeLatest } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { TypeKeys } from 'actions/transaction/constants';
import { SetScheduleTimezoneAction } from 'actions/transaction';
import { SetCurrentScheduleTimezoneAction } from '../../../actions/transaction/actionTypes/scheduleTimestamp';

export function* setCurrentScheduleTimezone({
  payload: raw
}: SetCurrentScheduleTimezoneAction): SagaIterator {
  const value = raw;

  yield call(setField, { value, raw });
}

export function* setField(payload: SetScheduleTimezoneAction['payload']) {
  yield put(setScheduleTimezone(payload));
}

export const currentScheduleTimezone = takeLatest(
  [TypeKeys.CURRENT_SCHEDULE_TIMEZONE_SET],
  setCurrentScheduleTimezone
);
