import {
  TypeKeys,
  ResetTransactionRequestedAction,
  ResetTransactionSuccessfulAction
} from '../types';
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
  SetGasPriceFieldAction
} from './types';

export type TInputGasLimit = typeof inputGasLimit;
export const inputGasLimit = (payload: InputGasLimitAction['payload']) => ({
  type: TypeKeys.GAS_LIMIT_INPUT,
  payload
});

export type TInputGasPrice = typeof inputGasPrice;
export const inputGasPrice = (payload: InputGasPriceAction['payload']) => ({
  type: TypeKeys.GAS_PRICE_INPUT,
  payload
});

export type TInputGasPriceIntent = typeof inputGasPrice;
export const inputGasPriceIntent = (payload: InputGasPriceIntentAction['payload']) => ({
  type: TypeKeys.GAS_PRICE_INPUT_INTENT,
  payload
});

export type TInputNonce = typeof inputNonce;
export const inputNonce = (payload: InputNonceAction['payload']) => ({
  type: TypeKeys.NONCE_INPUT,
  payload
});

export type TInputData = typeof inputData;
export const inputData = (payload: InputDataAction['payload']) => ({
  type: TypeKeys.DATA_FIELD_INPUT,
  payload
});

export type TSetGasLimitField = typeof setGasLimitField;
export const setGasLimitField = (
  payload: SetGasLimitFieldAction['payload']
): SetGasLimitFieldAction => ({
  type: TypeKeys.GAS_LIMIT_FIELD_SET,
  payload
});

export type TSetDataField = typeof setDataField;
export const setDataField = (payload: SetDataFieldAction['payload']): SetDataFieldAction => ({
  type: TypeKeys.DATA_FIELD_SET,
  payload
});

export type TSetToField = typeof setToField;
export const setToField = (payload: SetToFieldAction['payload']): SetToFieldAction => ({
  type: TypeKeys.TO_FIELD_SET,
  payload
});

export type TSetNonceField = typeof setNonceField;
export const setNonceField = (payload: SetNonceFieldAction['payload']): SetNonceFieldAction => ({
  type: TypeKeys.NONCE_FIELD_SET,
  payload
});

export type TSetValueField = typeof setValueField;
export const setValueField = (payload: SetValueFieldAction['payload']): SetValueFieldAction => ({
  type: TypeKeys.VALUE_FIELD_SET,
  payload
});

export type TSetGasPriceField = typeof setGasPriceField;
export const setGasPriceField = (
  payload: SetGasPriceFieldAction['payload']
): SetGasPriceFieldAction => ({
  type: TypeKeys.GAS_PRICE_FIELD_SET,
  payload
});

export type TResetTransactionRequested = typeof resetTransactionRequested;
export const resetTransactionRequested = (): ResetTransactionRequestedAction => ({
  type: TypeKeys.RESET_REQUESTED
});

export type TResetTransactionSuccessful = typeof resetTransactionSuccessful;
export const resetTransactionSuccessful = (
  payload: ResetTransactionSuccessfulAction['payload']
): ResetTransactionSuccessfulAction => ({
  type: TypeKeys.RESET_SUCCESSFUL,
  payload
});
