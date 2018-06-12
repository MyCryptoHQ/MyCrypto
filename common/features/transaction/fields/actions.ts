import {
  TRANSACTION,
  ResetTransactionRequestedAction,
  ResetTransactionSuccessfulAction
} from '../types';
import {
  TRANSACTION_FIELDS,
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
  type: TRANSACTION_FIELDS.GAS_LIMIT_INPUT,
  payload
});

export type TInputGasPrice = typeof inputGasPrice;
export const inputGasPrice = (payload: InputGasPriceAction['payload']) => ({
  type: TRANSACTION_FIELDS.GAS_PRICE_INPUT,
  payload
});

export type TInputGasPriceIntent = typeof inputGasPrice;
export const inputGasPriceIntent = (payload: InputGasPriceIntentAction['payload']) => ({
  type: TRANSACTION_FIELDS.GAS_PRICE_INPUT_INTENT,
  payload
});

export type TInputNonce = typeof inputNonce;
export const inputNonce = (payload: InputNonceAction['payload']) => ({
  type: TRANSACTION_FIELDS.NONCE_INPUT,
  payload
});

export type TInputData = typeof inputData;
export const inputData = (payload: InputDataAction['payload']) => ({
  type: TRANSACTION_FIELDS.DATA_FIELD_INPUT,
  payload
});

export type TSetGasLimitField = typeof setGasLimitField;
export const setGasLimitField = (
  payload: SetGasLimitFieldAction['payload']
): SetGasLimitFieldAction => ({
  type: TRANSACTION_FIELDS.GAS_LIMIT_FIELD_SET,
  payload
});

export type TSetDataField = typeof setDataField;
export const setDataField = (payload: SetDataFieldAction['payload']): SetDataFieldAction => ({
  type: TRANSACTION_FIELDS.DATA_FIELD_SET,
  payload
});

export type TSetToField = typeof setToField;
export const setToField = (payload: SetToFieldAction['payload']): SetToFieldAction => ({
  type: TRANSACTION_FIELDS.TO_FIELD_SET,
  payload
});

export type TSetNonceField = typeof setNonceField;
export const setNonceField = (payload: SetNonceFieldAction['payload']): SetNonceFieldAction => ({
  type: TRANSACTION_FIELDS.NONCE_FIELD_SET,
  payload
});

export type TSetValueField = typeof setValueField;
export const setValueField = (payload: SetValueFieldAction['payload']): SetValueFieldAction => ({
  type: TRANSACTION_FIELDS.VALUE_FIELD_SET,
  payload
});

export type TSetGasPriceField = typeof setGasPriceField;
export const setGasPriceField = (
  payload: SetGasPriceFieldAction['payload']
): SetGasPriceFieldAction => ({
  type: TRANSACTION_FIELDS.GAS_PRICE_FIELD_SET,
  payload
});

export type TResetTransactionRequested = typeof resetTransactionRequested;
export const resetTransactionRequested = (): ResetTransactionRequestedAction => ({
  type: TRANSACTION.RESET_REQUESTED
});

export type TResetTransactionSuccessful = typeof resetTransactionSuccessful;
export const resetTransactionSuccessful = (
  payload: ResetTransactionSuccessfulAction['payload']
): ResetTransactionSuccessfulAction => ({
  type: TRANSACTION.RESET_SUCCESSFUL,
  payload
});
