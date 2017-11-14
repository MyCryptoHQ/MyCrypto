import { TypeKeys } from 'actions/transactionFields/constants';
import { Wei, Nonce, Address, Data } from 'libs/units';
export {
  SetGasLimitFieldAction,
  SetDataFieldAction,
  SetAddressFieldAction,
  SetNonceFieldAction,
  SetAmountFieldAction,
  ClearFieldsAction
};

// We can compute field validity by checking if the value is null

interface SetGasLimitFieldAction {
  type: TypeKeys.GAS_LIMIT_FIELD_SET;
  payload: {
    raw: string;
    value: Wei | null;
  };
}

interface SetDataFieldAction {
  type: TypeKeys.DATA_FIELD_SET;
  payload: {
    raw: string;
    value: Data | null;
  };
}

interface SetAddressFieldAction {
  type: TypeKeys.ADDRESS_FIELD_SET;
  payload: {
    raw: string;
    value: Address | null;
  };
}

interface SetNonceFieldAction {
  type: TypeKeys.NONCE_FIELD_SET;
  payload: {
    raw: string;
    value: Nonce | null;
  };
}

interface SetAmountFieldAction {
  type: TypeKeys.AMOUNT_FIELD_SET;
  payload: {
    raw: string;
    value: Wei | null;
  };
}

interface ClearFieldsAction {
  type: TypeKeys.CLEAR_FIELDS;
}

export type TransactionFieldAction =
  | SetGasLimitFieldAction
  | SetDataFieldAction
  | SetAddressFieldAction
  | SetNonceFieldAction
  | SetAmountFieldAction
  | ClearFieldsAction;
