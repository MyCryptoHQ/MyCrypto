import { setWindowSizeField } from 'actions/transaction/actionCreators/fields';
import { call, put, takeLatest } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { TypeKeys } from 'actions/transaction/constants';
import { SetWindowSizeFieldAction } from 'actions/transaction';
import { SetCurrentWindowSizeAction } from '../../../actions/transaction/actionTypes/windowSize';
import { validNumber } from 'libs/validators';
import BN from 'bn.js';

export function* setCurrentWindowSize({ payload: raw }: SetCurrentWindowSizeAction): SagaIterator {
  let value: BN | null = null;

  if (!validNumber(parseInt(raw, 10))) {
    yield call(setField, { raw, value: null });
  }

  value = new BN(raw);

  yield call(setField, { value, raw });
}

export function* setField(payload: SetWindowSizeFieldAction['payload']) {
  yield put(setWindowSizeField(payload));
}

export const currentWindowSize = takeLatest(
  [TypeKeys.CURRENT_WINDOW_SIZE_SET],
  setCurrentWindowSize
);
