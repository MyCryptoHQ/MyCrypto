import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { SagaIterator, delay } from 'redux-saga';
import {
  inputGasPrice,
  setDataField,
  setGasLimitField,
  setGasPriceField,
  setNonceField
} from 'actions/transaction/actionCreators';
import {
  InputDataAction,
  InputGasLimitAction,
  InputGasPriceAction,
  InputGasPriceIntentAction,
  InputNonceAction,
  TypeKeys
} from 'actions/transaction';
import { isValidHex, isValidNonce, gasPriceValidator, gasLimitValidator } from 'libs/validators';
import { Data, Wei, Nonce, gasPriceToBase } from 'libs/units';

const SLIDER_DEBOUNCE_INPUT_DELAY = 300;

export function* handleDataInput({ payload }: InputDataAction): SagaIterator {
  const validData: boolean = yield call(isValidHex, payload);
  yield put(setDataField({ raw: payload, value: validData ? Data(payload) : null }));
}

export function* handleGasLimitInput({ payload }: InputGasLimitAction): SagaIterator {
  const validGasLimit: boolean = yield call(gasLimitValidator, payload);
  yield put(setGasLimitField({ raw: payload, value: validGasLimit ? Wei(payload) : null }));
}

export function* handleGasPriceInput({ payload }: InputGasPriceAction): SagaIterator {
  const priceFloat = parseFloat(payload);
  const validGasPrice: boolean = yield call(gasPriceValidator, priceFloat);
  yield put(
    setGasPriceField({
      raw: payload,
      value: validGasPrice ? gasPriceToBase(priceFloat) : Wei('0')
    })
  );
}

export function* handleGasPriceInputIntent({ payload }: InputGasPriceIntentAction): SagaIterator {
  yield call(delay, SLIDER_DEBOUNCE_INPUT_DELAY);
  // Important to put and not fork handleGasPriceInput, we want
  // action to go to reducers.
  yield put(inputGasPrice(payload));
}

export function* handleNonceInput({ payload }: InputNonceAction): SagaIterator {
  const validNonce: boolean = yield call(isValidNonce, payload);
  yield put(setNonceField({ raw: payload, value: validNonce ? Nonce(payload) : null }));
}

export const fields = [
  takeEvery(TypeKeys.DATA_FIELD_INPUT, handleDataInput),
  takeEvery(TypeKeys.GAS_LIMIT_INPUT, handleGasLimitInput),
  takeEvery(TypeKeys.GAS_PRICE_INPUT, handleGasPriceInput),
  takeEvery(TypeKeys.NONCE_INPUT, handleNonceInput),
  takeLatest(TypeKeys.GAS_PRICE_INPUT_INTENT, handleGasPriceInputIntent)
];
