import {
  SetGasLimitFieldAction,
  SetDataFieldAction,
  SetToFieldAction,
  SetNonceFieldAction,
  SetValueFieldAction,
  ResetAction
} from '../actionTypes';
import { TypeKeys } from 'actions/transaction/constants';
export {
  TSetGasLimitField,
  TSetDataField,
  TSetToField,
  TSetNonceField,
  TSetValueField,
  TReset,
  setGasLimitField,
  setDataField,
  setToField,
  setNonceField,
  setValueField,
  reset
};
import { ThunkAction } from 'redux-thunk';
import { AppState } from 'reducers';
import { encodeTransfer } from 'libs/transaction/utils/token';
import { bufferToHex } from 'ethereumjs-util';

type TSetGasLimitField = typeof setGasLimitField;
const setGasLimitField = (
  payload: SetGasLimitFieldAction['payload']
): SetGasLimitFieldAction => ({
  type: TypeKeys.GAS_LIMIT_FIELD_SET,
  payload
});

type TSetDataField = typeof setDataField;
const setDataField = (
  payload: SetDataFieldAction['payload']
): SetDataFieldAction => ({
  type: TypeKeys.DATA_FIELD_SET,
  payload
});

type TSetToField = typeof setToField;
const createToAction = (
  payload: SetToFieldAction['payload']
): SetToFieldAction => ({
  type: TypeKeys.TO_FIELD_SET,
  payload
});

const setToField = (
  payload: SetToFieldAction['payload']
): ThunkAction<any, AppState, null> => (dispatch, getState) => {
  const { transaction } = getState();
  const { meta: { unit, tokenValue } } = transaction;

  if (!isEtherUnit(unit)) {
    // if its a token then re-code data
    if (payload.value && tokenValue.value) {
      const data = encodeTransfer(payload.value, tokenValue.value);
      dispatch(setDataField({ raw: bufferToHex(data), value: data }));
    }
  }

  return dispatch(createToAction(payload));
};

const isEtherUnit = (unit: string) => unit === 'ether';

type TSetNonceField = typeof setNonceField;
const setNonceField = (
  payload: SetNonceFieldAction['payload']
): SetNonceFieldAction => ({
  type: TypeKeys.NONCE_FIELD_SET,
  payload
});

type TSetValueField = typeof setValueField;
const setValueField = (
  payload: SetValueFieldAction['payload']
): SetValueFieldAction => ({
  type: TypeKeys.VALUE_FIELD_SET,
  payload
});

type TReset = typeof reset;
const reset = (): ResetAction => ({ type: TypeKeys.RESET });
