import { isEtherTransaction, getUnit, getDecimal } from 'selectors/transaction';
import { select, call, put, takeEvery } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { setTokenValue, setValueField } from 'actions/transaction/actionCreators';
import { SetCurrentValueAction, TypeKeys } from 'actions/transaction';
import { toTokenBase } from 'libs/units';
import { validateInput } from 'sagas/transaction/validationHelpers';
import parseDecimalNumber from 'parse-decimal-number';

function* setCurrentValue({ payload }: SetCurrentValueAction): SagaIterator {
  const parsedValue = parseDecimalNumber(payload, '.,')
    ? parseDecimalNumber(payload, '.,').toString()
    : parseDecimalNumber(payload) ? parseDecimalNumber(payload).toString() : '';
  const etherTransaction = yield select(isEtherTransaction);

  const unit: string = yield select(getUnit);
  const validNumber = isFinite(+parseFloat(parsedValue)) && +parsedValue > 0;
  const setter = etherTransaction ? setValueField : setTokenValue;
  if (!validNumber) {
    return yield put(setter({ raw: payload, value: null }));
  }
  const decimal: number = yield select(getDecimal);
  const value = toTokenBase(parsedValue, decimal);
  const isValid: boolean = yield call(validateInput, value, unit);
  yield put(setter({ raw: payload, value: isValid ? value : null }));
}

export const currentValue = takeEvery([TypeKeys.CURRENT_VALUE_SET], setCurrentValue);
