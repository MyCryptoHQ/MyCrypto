import { put, takeLatest } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { TypeKeys } from 'actions/schedule/constants';
import { setScheduleTimezone } from 'actions/schedule';
import { SetCurrentScheduleTimezoneAction } from 'actions/schedule/actionTypes/scheduleTimestamp';

export function* setCurrentScheduleTimezone({
  payload: raw
}: SetCurrentScheduleTimezoneAction): SagaIterator {
  const value = raw;

  yield put(setScheduleTimezone({ value, raw }));
}

export const currentScheduleTimezone = takeLatest(
  [TypeKeys.CURRENT_SCHEDULE_TIMEZONE_SET],
  setCurrentScheduleTimezone
);
