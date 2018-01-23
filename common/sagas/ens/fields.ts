import {
  TypeKeys,
  InputBidMaskFieldAction,
  InputBidValueFieldAction,
  setBidMaskField,
  InputSecretFieldAction,
  setBidValueField,
  setSecretField,
  SetBidMaskFieldAction,
  SetBidValueFieldAction,
  inputBidMaskField,
  inputBidValueField,
  inputSecretField,
  InitializeInputsAction
} from 'actions/ens';
import { put, takeEvery, call, select, all } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { valueHandler } from 'sagas/transaction/current/currentValue';
import { getBidValue, getBidMask } from 'selectors/ens';
import { AppState } from 'reducers';
import { validNumber } from 'libs/validators';
import { toWei, getDecimalFromEtherUnit } from 'libs/units';
import { generateMnemonic } from 'bip39';

function* handleBidMaskInput(action: InputBidMaskFieldAction): SagaIterator {
  const setter = setBidMaskField;
  yield call(valueHandler, action, setter);
}

function* validateBidMaskInput({
  type
}: SetBidMaskFieldAction | SetBidValueFieldAction): SagaIterator {
  const bidValue: AppState['ens']['fields']['bidValue'] = yield select(getBidValue);
  const bidMask: AppState['ens']['fields']['bidMask'] = yield select(getBidMask);
  if (type === TypeKeys.BID_VALUE_FIELD_SET) {
    if (bidValue.value) {
      const bidMaskRawIsNumber = yield call(validNumber, +bidMask.raw);
      const bidMaskValue = bidMaskRawIsNumber
        ? toWei(bidMask.raw, getDecimalFromEtherUnit('ether'))
        : null;
      if (!bidMaskValue || bidMaskValue.lt(bidValue.value)) {
        yield put(setBidMaskField({ ...bidMask, value: null }));
      } else {
        yield put(setBidMaskField({ value: bidMaskValue, raw: bidMask.raw }));
      }
    }
  } else {
    if (bidMask.value && bidValue.value) {
      if (bidMask.value.lt(bidValue.value)) {
        yield put(setBidMaskField({ ...bidMask, value: null }));
      }
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

function* initializeState(_: InitializeInputsAction): SagaIterator {
  const placeholderPhraseList = generateMnemonic().split(' ');
  const placeholderPhrase = placeholderPhraseList
    .splice(placeholderPhraseList.length - 3)
    .join(' ');

  yield all([
    put(inputBidMaskField('0.01')),
    put(inputBidValueField('0.01')),
    put(inputSecretField(placeholderPhrase))
  ]);
}

export const fields = [
  takeEvery(TypeKeys.BID_MASK_FIELD_INPUT, handleBidMaskInput),
  takeEvery(TypeKeys.BID_VALUE_FIELD_INPUT, handleBidValueInput),
  takeEvery(TypeKeys.SECRET_FIELD_INPUT, handleSecretFieldInput),
  takeEvery([TypeKeys.BID_MASK_FIELD_SET, TypeKeys.BID_VALUE_FIELD_SET], validateBidMaskInput),
  takeEvery([TypeKeys.INITIALIZE_INPUTS], initializeState)
];
