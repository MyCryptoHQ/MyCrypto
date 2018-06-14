import { Wei, Data, Address, Nonce } from 'libs/units';

export enum TRANSACTION_FIELDS {
  GAS_LIMIT_INPUT = 'GAS_LIMIT_INPUT',
  GAS_PRICE_INPUT = 'GAS_PRICE_INPUT',
  GAS_PRICE_INPUT_INTENT = 'GAS_PRICE_INPUT_INTENT',
  DATA_FIELD_INPUT = 'DATA_FIELD_INPUT',
  NONCE_INPUT = 'NONCE_INPUT',
  GAS_LIMIT_FIELD_SET = 'GAS_LIMIT_FIELD_SET',
  DATA_FIELD_SET = 'DATA_FIELD_SET',
  TO_FIELD_SET = 'TO_FIELD_SET',
  VALUE_FIELD_SET = 'VALUE_FIELD_SET',
  NONCE_FIELD_SET = 'NONCE_FIELD_SET',
  GAS_PRICE_FIELD_SET = 'GAS_PRICE_FIELD_SET'
}

export interface InputGasLimitAction {
  type: TRANSACTION_FIELDS.GAS_LIMIT_INPUT;
  payload: string;
}
export interface InputGasPriceAction {
  type: TRANSACTION_FIELDS.GAS_PRICE_INPUT;
  payload: string;
}
export interface InputGasPriceIntentAction {
  type: TRANSACTION_FIELDS.GAS_PRICE_INPUT_INTENT;
  payload: string;
}
export interface InputDataAction {
  type: TRANSACTION_FIELDS.DATA_FIELD_INPUT;
  payload: string;
}
export interface InputNonceAction {
  type: TRANSACTION_FIELDS.NONCE_INPUT;
  payload: string;
}

export interface SetGasLimitFieldAction {
  type: TRANSACTION_FIELDS.GAS_LIMIT_FIELD_SET;
  payload: {
    raw: string;
    value: Wei | null;
  };
}

export interface SetGasPriceFieldAction {
  type: TRANSACTION_FIELDS.GAS_PRICE_FIELD_SET;
  payload: {
    raw: string;
    value: Wei | null;
  };
}

export interface SetDataFieldAction {
  type: TRANSACTION_FIELDS.DATA_FIELD_SET;
  payload: {
    raw: string;
    value: Data | null;
  };
}

export interface SetToFieldAction {
  type: TRANSACTION_FIELDS.TO_FIELD_SET;
  payload: {
    raw: string;
    value: Address | null;
  };
}

export interface SetNonceFieldAction {
  type: TRANSACTION_FIELDS.NONCE_FIELD_SET;
  payload: {
    raw: string;
    value: Nonce | null;
  };
}

export interface SetValueFieldAction {
  type: TRANSACTION_FIELDS.VALUE_FIELD_SET;
  payload: {
    raw: string;
    value: Wei | null;
  };
}

export type InputFieldAction = InputNonceAction | InputGasLimitAction | InputDataAction;

export type FieldAction =
  | SetGasLimitFieldAction
  | SetDataFieldAction
  | SetToFieldAction
  | SetNonceFieldAction
  | SetValueFieldAction
  | SetGasPriceFieldAction;
