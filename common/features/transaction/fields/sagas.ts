import { SagaIterator, delay } from 'redux-saga';
import { put, call, takeEvery, takeLatest } from 'redux-saga/effects';

import { Data, Wei, Nonce, gasPriceToBase } from 'libs/units';
import { isValidHex, isValidNonce, gasPriceValidator, gasLimitValidator } from 'libs/validators';
import * as types from './types';
import * as actions from './actions';

const SLIDER_DEBOUNCE_INPUT_DELAY = 300;

export function* handleDataInput({ payload }: types.InputDataAction): SagaIterator {
  const validData: boolean = yield call(isValidHex, payload);
  yield put(actions.setDataField({ raw: payload, value: validData ? Data(payload) : null }));
}

export function* handleGasLimitInput({ payload }: types.InputGasLimitAction): SagaIterator {
  const validGasLimit: boolean = yield call(gasLimitValidator, payload);
  yield put(
    actions.setGasLimitField({
      raw: payload,
      value: validGasLimit ? Wei(payload) : null
    })
  );
}

export function* handleGasPriceInput({ payload }: types.InputGasPriceAction): SagaIterator {
  const gasPrice = Number(payload);
  const validGasPrice: boolean = yield call(gasPriceValidator, gasPrice);
  yield put(
    actions.setGasPriceField({
      raw: payload,
      value: validGasPrice ? gasPriceToBase(gasPrice) : Wei('0')
    })
  );
}

export function* handleGasPriceInputIntent({
  payload
}: types.InputGasPriceIntentAction): SagaIterator {
  yield call(delay, SLIDER_DEBOUNCE_INPUT_DELAY);
  // Important to put and not fork handleGasPriceInput, we want
  // action to go to reducers.
  yield put(actions.inputGasPrice(payload));
}

export function* handleNonceInput({ payload }: types.InputNonceAction): SagaIterator {
  const validNonce: boolean = yield call(isValidNonce, payload);
  yield put(
    actions.setNonceField({
      raw: payload,
      value: validNonce ? Nonce(payload) : null
    })
  );
}

export const fieldsSaga = [
  takeEvery(types.TransactionFieldsActions.DATA_FIELD_INPUT, handleDataInput),
  takeEvery(types.TransactionFieldsActions.GAS_LIMIT_INPUT, handleGasLimitInput),
  takeEvery(types.TransactionFieldsActions.GAS_PRICE_INPUT, handleGasPriceInput),
  takeEvery(types.TransactionFieldsActions.NONCE_INPUT, handleNonceInput),
  takeLatest(types.TransactionFieldsActions.GAS_PRICE_INPUT_INTENT, handleGasPriceInputIntent)
];
