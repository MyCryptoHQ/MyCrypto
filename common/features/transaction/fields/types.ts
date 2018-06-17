import { Wei, Data, Address, Nonce } from 'libs/units';

export interface TransactionFieldsState {
  to: SetToFieldAction['payload'];
  data: SetDataFieldAction['payload'];
  nonce: SetNonceFieldAction['payload'];
  value: { raw: string; value: Wei | null }; // TODO: fix this workaround since some of the payload is optional
  gasLimit: SetGasLimitFieldAction['payload'];
  gasPrice: { raw: string; value: Wei };
}

export enum TransactionFieldsActions {
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
  type: TransactionFieldsActions.GAS_LIMIT_INPUT;
  payload: string;
}

export interface InputGasPriceAction {
  type: TransactionFieldsActions.GAS_PRICE_INPUT;
  payload: string;
}

export interface InputGasPriceIntentAction {
  type: TransactionFieldsActions.GAS_PRICE_INPUT_INTENT;
  payload: string;
}

export interface InputDataAction {
  type: TransactionFieldsActions.DATA_FIELD_INPUT;
  payload: string;
}

export interface InputNonceAction {
  type: TransactionFieldsActions.NONCE_INPUT;
  payload: string;
}

export interface SetGasLimitFieldAction {
  type: TransactionFieldsActions.GAS_LIMIT_FIELD_SET;
  payload: {
    raw: string;
    value: Wei | null;
  };
}

export interface SetGasPriceFieldAction {
  type: TransactionFieldsActions.GAS_PRICE_FIELD_SET;
  payload: {
    raw: string;
    value: Wei | null;
  };
}

export interface SetDataFieldAction {
  type: TransactionFieldsActions.DATA_FIELD_SET;
  payload: {
    raw: string;
    value: Data | null;
  };
}

export interface SetToFieldAction {
  type: TransactionFieldsActions.TO_FIELD_SET;
  payload: {
    raw: string;
    value: Address | null;
  };
}

export interface SetNonceFieldAction {
  type: TransactionFieldsActions.NONCE_FIELD_SET;
  payload: {
    raw: string;
    value: Nonce | null;
  };
}

export interface SetValueFieldAction {
  type: TransactionFieldsActions.VALUE_FIELD_SET;
  payload: {
    raw: string;
    value: Wei | null;
  };
}

export type InputFieldAction = InputNonceAction | InputGasLimitAction | InputDataAction;

export type TransactionFieldAction =
  | SetGasLimitFieldAction
  | SetDataFieldAction
  | SetToFieldAction
  | SetNonceFieldAction
  | SetValueFieldAction
  | SetGasPriceFieldAction;
