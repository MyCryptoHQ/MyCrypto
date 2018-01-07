import BN from 'bn.js';
import { call, put, takeEvery } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import {
  setDataField,
  setGasLimitField,
  setGasPriceField,
  setNonceField
} from 'actions/transaction/actionCreators';
import {
  InputDataAction,
  InputGasLimitAction,
  InputGasPriceAction,
  InputNonceAction,
  TypeKeys
} from 'actions/transaction';
import { isValidHex, isValidNonce, validNumber } from 'libs/validators';
import { Data, Wei, Nonce, gasPricetoBase } from 'libs/units';

export function* handleDataInput({ payload }: InputDataAction): SagaIterator {
  const validData: boolean = yield call(isValidHex, payload);
  yield put(setDataField({ raw: payload, value: validData ? Data(payload) : null }));
}

export function* handleGasLimitInput({ payload }: InputGasLimitAction): SagaIterator {
  const validGasLimit =
    validNumber(+payload) && isFinite(parseFloat(payload)) && parseFloat(payload);
  yield put(setGasLimitField({ raw: payload, value: validGasLimit ? Wei(payload) : null }));
}

export function* handleGasPriceInput({ payload }: InputGasPriceAction): SagaIterator {
  const priceFloat = parseFloat(payload);
  const validGasPrice = validNumber(priceFloat) && isFinite(priceFloat) && priceFloat > 0;
  yield put(
    setGasPriceField({
      raw: payload,
      value: validGasPrice ? gasPricetoBase(priceFloat) : new BN(0)
    })
  );
}

export function* handleNonceInput({ payload }: InputNonceAction): SagaIterator {
  const validNonce: boolean = yield call(isValidNonce, payload);
  yield put(setNonceField({ raw: payload, value: validNonce ? Nonce(payload) : null }));
}

export const fields = [
  takeEvery(TypeKeys.DATA_FIELD_INPUT, handleDataInput),
  takeEvery(TypeKeys.GAS_LIMIT_INPUT, handleGasLimitInput),
  takeEvery(TypeKeys.GAS_PRICE_INPUT, handleGasPriceInput),
  takeEvery(TypeKeys.NONCE_INPUT, handleNonceInput)
];
