import { select, call, put, takeEvery } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { setDataField, setGasLimitField, setNonceField } from 'actions/transaction/actionCreators';
import {
  InputDataAction,
  InputGasLimitAction,
  InputNonceAction,
  TypeKeys
} from 'actions/transaction';
import { isValidHex } from 'libs/validators';
import { Data, Wei, Nonce } from 'libs/units';
import { isPositiveInteger } from 'utils/helpers';

function* handleDataInput({ payload }: InputDataAction): SagaIterator {
  const validData: boolean = yield call(isValidHex, payload);
  yield put(setDataField({ raw: payload, value: validData ? Data(payload) : null }));
}

function* handleGasLimitInput({ payload }: InputGasLimitAction): SagaIterator {
  const validGasLimit = isFinite(parseFloat(payload)) && parseFloat(payload);
  yield put(setGasLimitField({ raw: payload, value: validGasLimit ? Wei(payload) : null }));
}

const isValidNonce = (value: string): boolean => {
  let valid;
  if (value === '0') {
    valid = true;
  } else if (!value) {
    valid = false;
  } else {
    valid = isPositiveInteger(+value);
  }
  return valid;
};

function* handleNonceInput({ payload }: InputNonceAction): SagaIterator {
  const validNonce: boolean = yield call(isValidNonce, payload);
  yield put(setNonceField({ raw: payload, value: validNonce ? Nonce(payload) : null }));
}

export function* fields(): SagaIterator {
  yield [
    takeEvery(TypeKeys.DATA_FIELD_INPUT, handleDataInput),
    takeEvery(TypeKeys.GAS_LIMIT_INPUT, handleGasLimitInput),
    takeEvery(TypeKeys.NONCE_INPUT, handleNonceInput)
  ];
}
