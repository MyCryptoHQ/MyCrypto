import { Wei, Data, Address, Nonce } from 'libs/units';
import { TypeKeys } from '../types';

export interface InputGasLimitAction {
  type: TypeKeys.GAS_LIMIT_INPUT;
  payload: string;
}
export interface InputGasPriceAction {
  type: TypeKeys.GAS_PRICE_INPUT;
  payload: string;
}
export interface InputGasPriceIntentAction {
  type: TypeKeys.GAS_PRICE_INPUT_INTENT;
  payload: string;
}
export interface InputDataAction {
  type: TypeKeys.DATA_FIELD_INPUT;
  payload: string;
}
export interface InputNonceAction {
  type: TypeKeys.NONCE_INPUT;
  payload: string;
}

export interface SetGasLimitFieldAction {
  type: TypeKeys.GAS_LIMIT_FIELD_SET;
  payload: {
    raw: string;
    value: Wei | null;
  };
}

export interface SetGasPriceFieldAction {
  type: TypeKeys.GAS_PRICE_FIELD_SET;
  payload: {
    raw: string;
    value: Wei | null;
  };
}

export interface SetDataFieldAction {
  type: TypeKeys.DATA_FIELD_SET;
  payload: {
    raw: string;
    value: Data | null;
  };
}

export interface SetToFieldAction {
  type: TypeKeys.TO_FIELD_SET;
  payload: {
    raw: string;
    value: Address | null;
  };
}

export interface SetNonceFieldAction {
  type: TypeKeys.NONCE_FIELD_SET;
  payload: {
    raw: string;
    value: Nonce | null;
  };
}

export interface SetValueFieldAction {
  type: TypeKeys.VALUE_FIELD_SET;
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
