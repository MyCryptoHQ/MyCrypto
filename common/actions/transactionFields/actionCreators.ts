import {
  SetGasLimitFieldAction,
  SetDataFieldAction,
  SetToFieldAction,
  SetNonceFieldAction,
  SetValueFieldAction,
  ClearFieldsAction
} from './actionTypes';
import { TypeKeys } from 'actions/transactionFields/constants';
export {
  TSetGasLimitField,
  TSetDataField,
  TSetToField,
  TSetNonceField,
  TSetValueField,
  TClearFields,
  setGasLimitField,
  setDataField,
  setAddressField,
  setNonceField,
  setAmountField,
  clearFields
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

type TSetToField = typeof setAddressField;
const setAddressField = (
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

type TSetValueField = typeof setAmountField;
const setAmountField = (
  payload: SetValueFieldAction['payload']
): SetValueFieldAction => ({
  type: TypeKeys.VALUE_FIELD_SET,
  payload
});

type TClearFields = typeof clearFields;
const clearFields = (): ClearFieldsAction => ({ type: TypeKeys.CLEAR_FIELDS });
