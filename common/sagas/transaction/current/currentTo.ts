import { isEtherTransaction } from 'selectors/transaction';
import { SetCurrentToAction } from 'actions/transaction/actionTypes/current';
import { setToField } from 'actions/transaction/actionCreators/fields';
import { setTokenTo } from 'actions/transaction/actionCreators/meta';
import { Address } from 'libs/units';
import { select, call, put, takeEvery } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { isValidENSorEtherAddress } from 'libs/validators';
import { TypeKeys } from 'actions/transaction/constants';

export function* setCurrentTo({ payload: raw }: SetCurrentToAction): SagaIterator {
  const validAddress: boolean = yield call(isValidENSorEtherAddress, raw);
  const etherTransaction: boolean = yield select(isEtherTransaction);
  const value = validAddress ? Address(raw) : null;
  const payload = { raw, value };
  if (etherTransaction) {
    yield put(setToField(payload));
  } else {
    yield put(setTokenTo(payload));
  }
}

export const currentTo = takeEvery([TypeKeys.CURRENT_TO_SET], setCurrentTo);
