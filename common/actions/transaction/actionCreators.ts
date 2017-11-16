import {
  SetGasLimitFieldAction,
  SetDataFieldAction,
  SetToFieldAction,
  SetNonceFieldAction,
  SetValueFieldAction,
  ResetAction,
  SetUnitMetaAction,
  SetDecimalMetaAction
} from './actionTypes';
import { TypeKeys } from 'actions/transaction/constants';
export {
  TSetDecimalMeta,
  TSetUnitMeta,
  TSetGasLimitField,
  TSetDataField,
  TSetToField,
  TSetNonceField,
  TSetValueField,
  TReset,
  setUnitMeta,
  setDecimalMeta,
  setGasLimitField,
  setDataField,
  setToField,
  setNonceField,
  setValueField,
  reset
};

type TSetUnitMeta = typeof setUnitMeta;
const setUnitMeta = (payload: SetUnitMetaAction['payload']) => ({
  type: TypeKeys.UNIT_META_SET,
  payload
});

type TSetDecimalMeta = typeof setDecimalMeta;
const setDecimalMeta = (payload: SetDecimalMetaAction['payload']) => ({
  type: TypeKeys.DECIMAL_META_SET,
  payload
});

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
