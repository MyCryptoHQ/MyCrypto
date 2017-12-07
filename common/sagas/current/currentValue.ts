import { isEtherTransaction, getUnit } from 'selectors/transaction';
import { select, call, put, takeEvery } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { setTokenTo, setToField } from 'actions/transaction/actionCreators';
import { SetCurrentValueAction, TypeKeys } from 'actions/transaction';

import { validateInput } from 'sagas/meta/unitSwap';
import { TokenValue } from 'libs/units';

function* setCurrentValue({ payload }: SetCurrentValueAction): SagaIterator {
  const etherTransaction = yield select(isEtherTransaction);

  const unit: string = yield select(getUnit);
  const validNumber = isFinite(+payload) && +payload > 0;
  const setter = etherTransaction ? setToField : setTokenTo;
  if (!validNumber) {
    yield put(setter({ raw: payload, value: null }));
  }
  const value = TokenValue(payload);
  const isValid: boolean = yield call(validateInput, value, unit);
  yield put(setter({ raw: payload, value: isValid ? value : null }));
}

export function* currentValue(): SagaIterator {
  yield takeEvery([TypeKeys.CURRENT_VALUE_SET], setCurrentValue);
}
