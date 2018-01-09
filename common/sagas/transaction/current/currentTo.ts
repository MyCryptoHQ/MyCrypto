import { isEtherTransaction } from 'selectors/transaction';
import { SetCurrentToAction } from 'actions/transaction/actionTypes/current';
import { setToField } from 'actions/transaction/actionCreators/fields';
import { setTokenTo } from 'actions/transaction/actionCreators/meta';
import { Address } from 'libs/units';
import { select, call, put, takeLatest } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { isValidENSAddress, isValidETHAddress } from 'libs/validators';
import { TypeKeys } from 'actions/transaction/constants';

export function* setCurrentTo({ payload: raw }: SetCurrentToAction): SagaIterator {
  const validAddress: boolean = yield call(isValidETHAddress, raw);
  const validEns: boolean = yield call(isValidENSAddress, raw);
  const etherTransaction: boolean = yield select(isEtherTransaction);

  let value: Buffer | null = null;
  let error: string | null = null;
  if (validAddress) {
    value = Address(raw);
  } else if (validEns) {
    // TODO: Resolve ENS on networks that support it, error on ones that don't
    error = 'ENS is not supported yet';
  }

  const payload = { raw, value, error };
  if (etherTransaction) {
    yield put(setToField(payload));
  } else {
    yield put(setTokenTo(payload));
  }
}

export const currentTo = takeLatest([TypeKeys.CURRENT_TO_SET], setCurrentTo);
