import { setScheduleTimestampField } from 'actions/transaction/actionCreators/fields';
import { call, put, takeLatest } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { TypeKeys } from 'actions/transaction/constants';
import { SetScheduleTimestampFieldAction } from 'actions/transaction';
import { SetCurrentScheduleTimestampAction } from '../../../actions/transaction/actionTypes/scheduleTimestamp';

export function* setCurrentScheduleTimestamp({
  payload: raw
}: SetCurrentScheduleTimestampAction): SagaIterator {
  let value: Date | null = null;

  value = new Date(raw);

  yield call(setField, { value, raw });
}

export function* setField(payload: SetScheduleTimestampFieldAction['payload']) {
  yield put(setScheduleTimestampField(payload));
}

export const currentScheduleTimestamp = takeLatest(
  [TypeKeys.CURRENT_SCHEDULE_TIMESTAMP_SET],
  setCurrentScheduleTimestamp
);
