import {
  SetGasLimitFieldAction,
  SetDataFieldAction,
  SetAddressFieldAction,
  SetNonceFieldAction,
  SetAmountFieldAction,
  ClearFieldsAction
} from './actionTypes';
import { TypeKeys } from 'actions/transactionFields/constants';
export {
  TSetGasLimitField,
  TSetDataField,
  TSetAddressField,
  TSetNonceField,
  TSetAmountField,
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

type TSetAddressField = typeof setAddressField;
const setAddressField = (
  payload: SetAddressFieldAction['payload']
): SetAddressFieldAction => ({
  type: TypeKeys.ADDRESS_FIELD_SET,
  payload
});

type TSetNonceField = typeof setNonceField;
const setNonceField = (
  payload: SetNonceFieldAction['payload']
): SetNonceFieldAction => ({
  type: TypeKeys.NONCE_FIELD_SET,
  payload
});

type TSetAmountField = typeof setAmountField;
const setAmountField = (
  payload: SetAmountFieldAction['payload']
): SetAmountFieldAction => ({
  type: TypeKeys.AMOUNT_FIELD_SET,
  payload
});

type TClearFields = typeof clearFields;
const clearFields = (): ClearFieldsAction => ({ type: TypeKeys.CLEAR_FIELDS });
