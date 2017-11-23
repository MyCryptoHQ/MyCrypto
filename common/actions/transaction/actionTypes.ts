import { TypeKeys } from 'actions/transaction/constants';
import { Wei, Nonce, Address, Data, TokenValue } from 'libs/units';
import { ITransaction } from 'libs/transaction';
export {
  EstimateGasRequestedAction,
  EstimateGasSucceededAction,
  EstimateGasFailedAction,
  SetGasLimitFieldAction,
  SetDataFieldAction,
  SetToFieldAction,
  SetNonceFieldAction,
  SetValueFieldAction,
  SetUnitMetaAction,
  SetDecimalMetaAction,
  SetTokenToMetaAction,
  SetTokenValueMetaAction,
  ResetAction,
  FieldAction,
  TransactionAction,
  MetaAction,
  NetworkAction
};

/*Meta Actions*/

interface SetTokenToMetaAction {
  type: TypeKeys.TOKEN_TO_META_SET;
  payload: {
    raw: string;
    value: Address | null;
  };
}

interface SetDecimalMetaAction {
  type: TypeKeys.DECIMAL_META_SET;
  payload: number;
}

interface SetUnitMetaAction {
  type: TypeKeys.UNIT_META_SET;
  payload: string;
}

interface SetTokenValueMetaAction {
  type: TypeKeys.TOKEN_VALUE_META_SET;
  payload: {
    raw?: string;
    value: TokenValue | null;
  };
}
/* Network request actions */
interface EstimateGasRequestedAction {
  type: TypeKeys.ESTIMATE_GAS_REQUESTED;
  payload: ITransaction;
}

interface EstimateGasFailedAction {
  type: TypeKeys.ESTIMATE_GAS_FAILED;
}

interface EstimateGasSucceededAction {
  type: TypeKeys.ESTIMATE_GAS_SUCCEEDED;
}
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

interface ResetAction {
  type: TypeKeys.RESET;
}

type NetworkAction =
  | EstimateGasFailedAction
  | EstimateGasRequestedAction
  | EstimateGasSucceededAction;

type MetaAction =
  | SetUnitMetaAction
  | SetDecimalMetaAction
  | SetTokenValueMetaAction
  | SetTokenToMetaAction;

type FieldAction =
  | SetGasLimitFieldAction
  | SetDataFieldAction
  | SetToFieldAction
  | SetNonceFieldAction
  | SetValueFieldAction;

type TransactionAction = ResetAction | FieldAction | MetaAction | NetworkAction;
