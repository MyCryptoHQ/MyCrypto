import {
  TypeKeys,
  InputBidMaskFieldAction,
  InputBidValueFieldAction,
  setBidMaskField,
  InputSecretFieldAction,
  setBidValueField,
  setSecretField,
  SetBidMaskFieldAction,
  SetBidValueFieldAction
} from 'actions/ens';
import { put, takeEvery, call, select } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { valueHandler } from 'sagas/transaction/current/currentValue';
import { getBidValue, getBidMask } from 'selectors/ens';
import { AppState } from 'reducers';

function* handleBidMaskInput(action: InputBidMaskFieldAction): SagaIterator {
  const setter = setBidMaskField;
  yield call(valueHandler, action, setter);
}

function* validateBidMaskInput(_: SetBidMaskFieldAction | SetBidValueFieldAction): SagaIterator {
  const bidValue: AppState['ens']['fields']['bidValue'] = yield select(getBidValue);
  const bidMask: AppState['ens']['fields']['bidMask'] = yield select(getBidMask);
  if (bidMask.value && bidValue.value) {
    if (bidMask.value.lt(bidValue.value)) {
      yield put(setBidMaskField({ ...bidMask, value: null }));
    }
  }
}

function* handleBidValueInput(action: InputBidValueFieldAction): SagaIterator {
  const setter = setBidValueField;
  yield call(valueHandler, action, setter);
}

function* handleSecretFieldInput(action: InputSecretFieldAction): SagaIterator {
  if (!action.payload) {
    yield put(setSecretField({ raw: action.payload, value: null }));
  }
  yield put(setSecretField({ raw: action.payload, value: action.payload }));
}

export const fields = [
  takeEvery(TypeKeys.BID_MASK_FIELD_INPUT, handleBidMaskInput),
  takeEvery(TypeKeys.BID_VALUE_FIELD_INPUT, handleBidValueInput),
  takeEvery(TypeKeys.SECRET_FIELD_INPUT, handleSecretFieldInput),
  takeEvery([TypeKeys.BID_MASK_FIELD_SET, TypeKeys.BID_VALUE_FIELD_SET], validateBidMaskInput)
];
