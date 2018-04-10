import { put, takeLatest } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { TypeKeys } from 'actions/schedule/constants';
import { SetCurrentWindowStartAction } from 'actions/schedule/actionTypes/windowStart';
import { setWindowStartField } from 'actions/schedule';

export function* setCurrentWindowStart({
  payload: raw
}: SetCurrentWindowStartAction): SagaIterator {
  let value: number | null = null;

  value = parseInt(raw, 10);

  yield put(setWindowStartField({ value, raw }));
}

export const currentWindowStart = takeLatest(
  [TypeKeys.CURRENT_WINDOW_START_SET],
  setCurrentWindowStart
);
