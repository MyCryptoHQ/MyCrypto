import { put, takeLatest } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { TypeKeys } from 'actions/schedule/constants';
import { setScheduleTimestampField } from 'actions/schedule';
import { SetCurrentScheduleTimestampAction } from 'actions/schedule/actionTypes/scheduleTimestamp';

export function* setCurrentScheduleTimestamp({
  payload: raw
}: SetCurrentScheduleTimestampAction): SagaIterator {
  let value: Date | null = null;

  value = new Date(raw);

  yield put(setScheduleTimestampField({ value, raw }));
}

export const currentScheduleTimestamp = takeLatest(
  [TypeKeys.CURRENT_SCHEDULE_TIMESTAMP_SET],
  setCurrentScheduleTimestamp
);
