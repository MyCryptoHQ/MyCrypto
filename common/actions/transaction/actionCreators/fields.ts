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

const setToField = (
  payload: SetToFieldAction['payload']
): SetToFieldAction => ({
  type: TypeKeys.TO_FIELD_SET,
  payload
});

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
