import * as transactionTypes from '../types';
import * as types from './types';

export type TInputGasLimit = typeof inputGasLimit;
export const inputGasLimit = (payload: types.InputGasLimitAction['payload']) => ({
  type: types.TransactionFieldsActions.GAS_LIMIT_INPUT,
  payload
});

export type TInputGasPrice = typeof inputGasPrice;
export const inputGasPrice = (payload: types.InputGasPriceAction['payload']) => ({
  type: types.TransactionFieldsActions.GAS_PRICE_INPUT,
  payload
});

export type TInputGasPriceIntent = typeof inputGasPrice;
export const inputGasPriceIntent = (payload: types.InputGasPriceIntentAction['payload']) => ({
  type: types.TransactionFieldsActions.GAS_PRICE_INPUT_INTENT,
  payload
});

export type TInputNonce = typeof inputNonce;
export const inputNonce = (payload: types.InputNonceAction['payload']) => ({
  type: types.TransactionFieldsActions.NONCE_INPUT,
  payload
});

export type TInputData = typeof inputData;
export const inputData = (payload: types.InputDataAction['payload']) => ({
  type: types.TransactionFieldsActions.DATA_FIELD_INPUT,
  payload
});

export type TSetGasLimitField = typeof setGasLimitField;
export const setGasLimitField = (
  payload: types.SetGasLimitFieldAction['payload']
): types.SetGasLimitFieldAction => ({
  type: types.TransactionFieldsActions.GAS_LIMIT_FIELD_SET,
  payload
});

export type TSetDataField = typeof setDataField;
export const setDataField = (
  payload: types.SetDataFieldAction['payload']
): types.SetDataFieldAction => ({
  type: types.TransactionFieldsActions.DATA_FIELD_SET,
  payload
});

export type TSetToField = typeof setToField;
export const setToField = (payload: types.SetToFieldAction['payload']): types.SetToFieldAction => ({
  type: types.TransactionFieldsActions.TO_FIELD_SET,
  payload
});

export type TSetNonceField = typeof setNonceField;
export const setNonceField = (
  payload: types.SetNonceFieldAction['payload']
): types.SetNonceFieldAction => ({
  type: types.TransactionFieldsActions.NONCE_FIELD_SET,
  payload
});

export type TSetValueField = typeof setValueField;
export const setValueField = (
  payload: types.SetValueFieldAction['payload']
): types.SetValueFieldAction => ({
  type: types.TransactionFieldsActions.VALUE_FIELD_SET,
  payload
});

export type TSetGasPriceField = typeof setGasPriceField;
export const setGasPriceField = (
  payload: types.SetGasPriceFieldAction['payload']
): types.SetGasPriceFieldAction => ({
  type: types.TransactionFieldsActions.GAS_PRICE_FIELD_SET,
  payload
});

export type TResetTransactionRequested = typeof resetTransactionRequested;
export const resetTransactionRequested = (): transactionTypes.ResetTransactionRequestedAction => ({
  type: transactionTypes.TransactionActions.RESET_REQUESTED
});

export type TResetTransactionSuccessful = typeof resetTransactionSuccessful;
export const resetTransactionSuccessful = (
  payload: transactionTypes.ResetTransactionSuccessfulAction['payload']
): transactionTypes.ResetTransactionSuccessfulAction => ({
  type: transactionTypes.TransactionActions.RESET_SUCCESSFUL,
  payload
});
