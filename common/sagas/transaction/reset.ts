import { SagaIterator } from 'redux-saga';
import { TypeKeys } from 'actions/wallet';
import { takeEvery, put } from 'redux-saga/effects';
import { reset as resetActionCreator } from 'actions/transaction';

export function* resetTransactionState(): SagaIterator {
  yield put(resetActionCreator());
}

export const reset = [takeEvery([TypeKeys.WALLET_RESET], resetTransactionState)];
