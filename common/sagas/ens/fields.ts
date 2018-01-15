import {
  TypeKeys,
  InputBidMaskFieldAction,
  InputBidValueFieldAction,
  setBidMaskField,
  InputSecretFieldAction,
  setBidValueField,
  setSecretField
} from 'actions/ens';
import { put, takeEvery, call } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { valueHandler } from 'sagas/transaction/current/currentValue';

function* handleBidMaskInput(action: InputBidMaskFieldAction): SagaIterator {
  const setter = setBidMaskField;
  yield call(valueHandler, action, setter);
}

function* handleBidValueInput(action: InputBidValueFieldAction): SagaIterator {
  const setter = setBidValueField;
  yield call(valueHandler, action, setter);
}

function* handleSecretFieldInput(action: InputSecretFieldAction): SagaIterator {
  yield put(setSecretField(action.payload));
}

export const fields = [
  takeEvery(TypeKeys.BID_MASK_FIELD_INPUT, handleBidMaskInput),
  takeEvery(TypeKeys.BID_VALUE_FIELD_INPUT, handleBidValueInput),
  takeEvery(TypeKeys.SECRET_FIELD_INPUT, handleSecretFieldInput)
];
