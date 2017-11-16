import { TypeKeys } from 'actions/transaction/constants';
import { Wei, Nonce, Address, Data } from 'libs/units';
export {
  SetGasLimitFieldAction,
  SetDataFieldAction,
  SetToFieldAction,
  SetNonceFieldAction,
  SetValueFieldAction,
  SetUnitMetaAction,
  SetDecimalMetaAction,
  ResetAction,
  FieldAction,
  TransactionAction,
  MetaAction
};

interface SetDecimalMetaAction {
  type: TypeKeys.DECIMAL_META_SET;
  payload: number;
}

interface SetUnitMetaAction {
  type: TypeKeys.UNIT_META_SET;
  payload: string;
}

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
    raw: string;
    value: Wei | null;
  };
}

interface ResetAction {
  type: TypeKeys.RESET;
}

type MetaAction = SetUnitMetaAction | SetDecimalMetaAction;

type FieldAction =
  | SetGasLimitFieldAction
  | SetDataFieldAction
  | SetToFieldAction
  | SetNonceFieldAction
  | SetValueFieldAction;

type TransactionAction = ResetAction | FieldAction | MetaAction;
