import {
  SetGasLimitFieldAction,
  SetDataFieldAction,
  SetToFieldAction,
  SetNonceFieldAction,
  SetValueFieldAction,
  InputGasLimitAction,
  InputGasPriceAction,
  InputDataAction,
  InputNonceAction,
  ResetAction,
  SetGasPriceFieldAction
} from '../actionTypes';
import { TypeKeys } from 'actions/transaction/constants';

type TInputGasLimit = typeof inputGasLimit;
const inputGasLimit = (payload: InputGasLimitAction['payload']) => ({
  type: TypeKeys.GAS_LIMIT_INPUT,
  payload
});

type TInputGasPrice = typeof inputGasPrice;
const inputGasPrice = (payload: InputGasPriceAction['payload']) => ({
  type: TypeKeys.GAS_PRICE_INPUT,
  payload
});

type TInputNonce = typeof inputNonce;
const inputNonce = (payload: InputNonceAction['payload']) => ({
  type: TypeKeys.NONCE_INPUT,
  payload
});

type TInputData = typeof inputData;
const inputData = (payload: InputDataAction['payload']) => ({
  type: TypeKeys.DATA_FIELD_INPUT,
  payload
});

type TSetGasLimitField = typeof setGasLimitField;
const setGasLimitField = (payload: SetGasLimitFieldAction['payload']): SetGasLimitFieldAction => ({
  type: TypeKeys.GAS_LIMIT_FIELD_SET,
  payload
});

type TSetDataField = typeof setDataField;
const setDataField = (payload: SetDataFieldAction['payload']): SetDataFieldAction => ({
  type: TypeKeys.DATA_FIELD_SET,
  payload
});

type TSetToField = typeof setToField;
const setToField = (payload: SetToFieldAction['payload']): SetToFieldAction => ({
  type: TypeKeys.TO_FIELD_SET,
  payload
});

type TSetNonceField = typeof setNonceField;
const setNonceField = (payload: SetNonceFieldAction['payload']): SetNonceFieldAction => ({
  type: TypeKeys.NONCE_FIELD_SET,
  payload
});

type TSetValueField = typeof setValueField;
const setValueField = (payload: SetValueFieldAction['payload']): SetValueFieldAction => ({
  type: TypeKeys.VALUE_FIELD_SET,
  payload
});

type TSetGasPriceField = typeof setGasPriceField;
const setGasPriceField = (payload: SetGasPriceFieldAction['payload']): SetGasPriceFieldAction => ({
  type: TypeKeys.GAS_PRICE_FIELD_SET,
  payload
});

type TReset = typeof reset;
const reset = (): ResetAction => ({ type: TypeKeys.RESET });

export {
  TInputGasLimit,
  TInputGasPrice,
  TInputNonce,
  TInputData,
  TSetGasLimitField,
  TSetDataField,
  TSetToField,
  TSetNonceField,
  TSetValueField,
  TSetGasPriceField,
  TReset,
  inputGasLimit,
  inputGasPrice,
  inputNonce,
  inputData,
  setGasLimitField,
  setDataField,
  setToField,
  setNonceField,
  setValueField,
  setGasPriceField,
  reset
};
