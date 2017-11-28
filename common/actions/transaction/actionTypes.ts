import { TypeKeys } from 'actions/transaction/constants';
import { Wei, Nonce, Address, Data, TokenValue } from 'libs/units';
import { ITransaction } from 'libs/transaction';
import EthTx from 'ethereumjs-tx';
export {
  EstimateGasRequestedAction,
  EstimateGasSucceededAction,
  EstimateGasFailedAction,
  SignTransactionRequestedAction,
  SignTransactionSucceededAction,
  SignTransactionFailedAction,
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
  NetworkAction,
  SignAction
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
/* Network actions */
interface EstimateGasRequestedAction {
  type: TypeKeys.ESTIMATE_GAS_REQUESTED;
  payload: ITransaction;
}

interface EstimateGasSucceededAction {
  type: TypeKeys.ESTIMATE_GAS_SUCCEEDED;
}

interface EstimateGasFailedAction {
  type: TypeKeys.ESTIMATE_GAS_FAILED;
}

/* Signing / Async actions */

interface SignTransactionRequestedAction {
  type: TypeKeys.SIGN_TRANSACTION_REQUESTED;
  payload: EthTx;
}
interface SignTransactionSucceededAction {
  type: TypeKeys.SIGN_TRANSACTION_SUCCEEDED;
  payload: string;
}
interface SignTransactionFailedAction {
  type: TypeKeys.SIGN_TRANSACTION_FAILED;
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

type SignAction =
  | SignTransactionRequestedAction
  | SignTransactionSucceededAction
  | SignTransactionFailedAction;

type TransactionAction =
  | ResetAction
  | FieldAction
  | MetaAction
  | NetworkAction
  | SignAction;
