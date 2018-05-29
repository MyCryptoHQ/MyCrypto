import {
  SetGasLimitFieldAction,
  SetDataFieldAction,
  SetToFieldAction,
  SetNonceFieldAction,
  SetValueFieldAction,
  InputGasLimitAction,
  InputGasPriceAction,
  InputGasPriceIntentAction,
  InputDataAction,
  InputNonceAction,
  ResetTransactionRequestedAction,
  ResetTransactionSuccessfulAction,
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

type TInputGasPriceIntent = typeof inputGasPrice;
const inputGasPriceIntent = (payload: InputGasPriceIntentAction['payload']) => ({
  type: TypeKeys.GAS_PRICE_INPUT_INTENT,
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

type TResetTransactionRequested = typeof resetTransactionRequested;
const resetTransactionRequested = (): ResetTransactionRequestedAction => ({
  type: TypeKeys.RESET_REQUESTED
});

type TResetTransactionSuccessful = typeof resetTransactionSuccessful;
const resetTransactionSuccessful = (
  payload: ResetTransactionSuccessfulAction['payload']
): ResetTransactionSuccessfulAction => ({
  type: TypeKeys.RESET_SUCCESSFUL,
  payload
});

export {
  TInputGasLimit,
  TInputGasPrice,
  TInputGasPriceIntent,
  TInputNonce,
  TInputData,
  TSetGasLimitField,
  TSetDataField,
  TSetToField,
  TSetNonceField,
  TSetValueField,
  TSetGasPriceField,
  TResetTransactionRequested,
  TResetTransactionSuccessful,
  inputGasLimit,
  inputGasPrice,
  inputGasPriceIntent,
  inputNonce,
  inputData,
  setGasLimitField,
  setDataField,
  setToField,
  setNonceField,
  setValueField,
  setGasPriceField,
  resetTransactionRequested,
  resetTransactionSuccessful
};
