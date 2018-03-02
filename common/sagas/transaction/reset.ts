import { SagaIterator } from 'redux-saga';
import { TypeKeys } from 'actions/wallet';
import { takeEvery, put, select } from 'redux-saga/effects';
import {
  reset as resetActionCreator,
  setUnitMeta,
  TypeKeys as Constants
} from 'actions/transaction';
import { getNetworkUnit } from 'selectors/config';

export function* resetTransactionState(): SagaIterator {
  yield put(resetActionCreator());
}

export function* setNetworkUnit(): SagaIterator {
  const networkUnit = yield select(getNetworkUnit);
  yield put(setUnitMeta(networkUnit));
}

export const setDefaultUnit = takeEvery(Constants.RESET, setNetworkUnit);

export const reset = [takeEvery([TypeKeys.WALLET_RESET], resetTransactionState)];
