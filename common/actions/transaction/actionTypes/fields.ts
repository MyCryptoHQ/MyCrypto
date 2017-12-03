import { TypeKeys } from 'actions/transaction/constants';
import { Wei, Data, Address, Nonce } from 'libs/units';
export {
  SetGasLimitFieldAction,
  SetDataFieldAction,
  SetToFieldAction,
  SetNonceFieldAction,
  SetValueFieldAction,
  FieldAction
};

/*Field Actions*/

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

interface SetToFieldAction {
  type: TypeKeys.TO_FIELD_SET;
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

interface SetValueFieldAction {
  type: TypeKeys.VALUE_FIELD_SET;
  payload: {
    raw?: string;
    value: Wei | null;
  };
}

type FieldAction =
  | SetGasLimitFieldAction
  | SetDataFieldAction
  | SetToFieldAction
  | SetNonceFieldAction
  | SetValueFieldAction;
