import { put, takeLatest } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { TypeKeys } from 'actions/schedule/constants';
import { validNumber } from 'libs/validators';
import BN from 'bn.js';
import { SetCurrentWindowSizeAction } from 'actions/schedule/actionTypes/windowSize';
import { setWindowSizeField } from 'actions/schedule';

export function* setCurrentWindowSize({ payload: raw }: SetCurrentWindowSizeAction): SagaIterator {
  let value: BN | null = null;

  if (!validNumber(parseInt(raw, 10))) {
    yield put(setWindowSizeField({ raw, value: null }));
  }

  value = new BN(raw);

  yield put(setWindowSizeField({ value, raw }));
}

export const currentWindowSize = takeLatest(
  [TypeKeys.CURRENT_WINDOW_SIZE_SET],
  setCurrentWindowSize
);
