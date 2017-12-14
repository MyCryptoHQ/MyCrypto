import {
  isEtherTransaction,
  getUnit,
  getDecimal,
  getCurrentValue,
  ICurrentValue
} from 'selectors/transaction';
import { select, call, put, takeEvery } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { setTokenValue, setValueField } from 'actions/transaction/actionCreators';
import { SetCurrentValueAction, TypeKeys } from 'actions/transaction';
import { toTokenBase } from 'libs/units';
import { validateInput, IInput } from 'sagas/transaction/validationHelpers';
import { TypeKeys as ConfigTK } from 'actions/config';
import { validNumber } from 'libs/validators';

export function* setCurrentValue({ payload }: SetCurrentValueAction): SagaIterator {
  const etherTransaction = yield select(isEtherTransaction);

  const unit: string = yield select(getUnit);
  const validNum = isFinite(+payload) && +payload > 0;
  const setter = etherTransaction ? setValueField : setTokenValue;
  if (!validNum) {
    return yield put(setter({ raw: payload, value: null }));
  }
  const decimal: number = yield select(getDecimal);
  const value = toTokenBase(payload, decimal);
  const isValid: boolean = yield call(validateInput, value, unit);
  yield put(setter({ raw: payload, value: isValid ? value : null }));
}

export function* revalidateCurrentValue(): SagaIterator {
  const etherTransaction = yield select(isEtherTransaction);
  const currVal: ICurrentValue = yield select(getCurrentValue);
  const reparsedValue: null | ICurrentValue = yield call(reparseCurrentValue, currVal);
  const unit: string = yield select(getUnit);
  const setter = etherTransaction ? setValueField : setTokenValue;
  if (!reparsedValue || !reparsedValue.value) {
    return yield put(setter({ raw: currVal.raw, value: null }));
  }
  const isValid: boolean = yield call(validateInput, reparsedValue.value, unit);
  yield put(setter({ raw: reparsedValue.raw, value: isValid ? reparsedValue.value : null }));
}

export function* reparseCurrentValue(value: IInput): SagaIterator {
  const decimal = yield select(getDecimal);

  if (validNumber(+value.raw)) {
    return {
      raw: value.raw,
      value: toTokenBase(value.raw, decimal)
    };
  } else {
    return null;
  }
}
export const currentValue = [
  takeEvery([TypeKeys.CURRENT_VALUE_SET], setCurrentValue),
  takeEvery([TypeKeys.GAS_LIMIT_FIELD_SET, ConfigTK.CONFIG_GAS_PRICE], revalidateCurrentValue)
];
