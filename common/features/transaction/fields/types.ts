import { Wei, Data, Address, Nonce } from 'libs/units';
import { TRANSACTION } from '../types';

export interface InputGasLimitAction {
  type: TRANSACTION.GAS_LIMIT_INPUT;
  payload: string;
}
export interface InputGasPriceAction {
  type: TRANSACTION.GAS_PRICE_INPUT;
  payload: string;
}
export interface InputGasPriceIntentAction {
  type: TRANSACTION.GAS_PRICE_INPUT_INTENT;
  payload: string;
}
export interface InputDataAction {
  type: TRANSACTION.DATA_FIELD_INPUT;
  payload: string;
}
export interface InputNonceAction {
  type: TRANSACTION.NONCE_INPUT;
  payload: string;
}

export interface SetGasLimitFieldAction {
  type: TRANSACTION.GAS_LIMIT_FIELD_SET;
  payload: {
    raw: string;
    value: Wei | null;
  };
}

export interface SetGasPriceFieldAction {
  type: TRANSACTION.GAS_PRICE_FIELD_SET;
  payload: {
    raw: string;
    value: Wei | null;
  };
}

export interface SetDataFieldAction {
  type: TRANSACTION.DATA_FIELD_SET;
  payload: {
    raw: string;
    value: Data | null;
  };
}

export interface SetToFieldAction {
  type: TRANSACTION.TO_FIELD_SET;
  payload: {
    raw: string;
    value: Address | null;
  };
}

export interface SetNonceFieldAction {
  type: TRANSACTION.NONCE_FIELD_SET;
  payload: {
    raw: string;
    value: Nonce | null;
  };
}

export interface SetValueFieldAction {
  type: TRANSACTION.VALUE_FIELD_SET;
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
