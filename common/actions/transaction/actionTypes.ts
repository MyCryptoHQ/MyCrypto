import { TypeKeys } from 'actions/transaction/constants';
import { Wei, Nonce, Address, Data, TokenValue } from 'libs/units';
import { ITransaction } from 'libs/transaction';
import EthTx from 'ethereumjs-tx';
export {
  EstimateGasRequestedAction,
  EstimateGasSucceededAction,
  EstimateGasFailedAction,
  GetFromRequestedAction,
  GetFromSucceededAction,
  GetFromFailedAction,
  SignLocalTransactionRequestedAction,
  SignLocalTransactionSucceededAction,
  SignWeb3TransactionRequestedAction,
  SignWeb3TransactionSucceededAction,
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
  BroadcastLocalTransactionRequestedAction,
  BroadcastTransactionSucceededAction,
  BroadcastWeb3TransactionRequestedAction,
  BroadcastTransactionQueuedAction,
  BroadcastTransactionFailedAction,
  ResetAction,
  FieldAction,
  TransactionAction,
  MetaAction,
  NetworkAction,
  BroadcastAction,
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
interface GetFromRequestedAction {
  type: TypeKeys.GET_FROM_REQUESTED;
}
interface GetFromSucceededAction {
  type: TypeKeys.GET_FROM_SUCCEEDED;
  payload: string;
}
interface GetFromFailedAction {
  type: TypeKeys.GET_FROM_FAILED;
}

/*
 * Difference between the web3/local is that a local sign will actually sign the tx
 * While a web3 sign just gathers the rest of the nessesary parameters of the ethereum tx
 * to do the sign + broadcast in 1 step later on
 */

/* Signing / Async actions */
interface SignLocalTransactionRequestedAction {
  type: TypeKeys.SIGN_LOCAL_TRANSACTION_REQUESTED;
  payload: EthTx;
}
interface SignLocalTransactionSucceededAction {
  type: TypeKeys.SIGN_LOCAL_TRANSACTION_SUCCEEDED;
  payload: { signedTransaction: Buffer; indexingHash: string };
}

interface SignWeb3TransactionRequestedAction {
  type: TypeKeys.SIGN_WEB3_TRANSACTION_REQUESTED;
  payload: EthTx;
}
interface SignWeb3TransactionSucceededAction {
  type: TypeKeys.SIGN_WEB3_TRANSACTION_SUCCEEDED;
  payload: { transaction: Buffer; indexingHash: string };
}
interface SignTransactionFailedAction {
  type: TypeKeys.SIGN_TRANSACTION_FAILED;
}

/* Broadcasting actions */
interface BroadcastLocalTransactionRequestedAction {
  type: TypeKeys.BROADCAST_LOCAL_TRANSACTION_REQUESTED;
}
interface BroadcastWeb3TransactionRequestedAction {
  type: TypeKeys.BROADCAST_WEB3_TRANSACTION_REQUESTED;
}
interface BroadcastTransactionSucceededAction {
  type: TypeKeys.BROADCAST_TRANSACTION_SUCCEEDED;
  payload: { indexingHash: string; broadcastedHash: string };
}
interface BroadcastTransactionQueuedAction {
  type: TypeKeys.BROADCAST_TRANSACTION_QUEUED;
  payload: { indexingHash: string; serializedTransaction: Buffer };
}
interface BroadcastTransactionFailedAction {
  type: TypeKeys.BROADCAST_TRASACTION_FAILED;
  payload: { indexingHash: string };
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
  | EstimateGasSucceededAction
  | GetFromRequestedAction
  | GetFromSucceededAction
  | GetFromFailedAction;

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
  | SignLocalTransactionRequestedAction
  | SignLocalTransactionSucceededAction
  | SignWeb3TransactionRequestedAction
  | SignWeb3TransactionSucceededAction
  | SignTransactionFailedAction;

type BroadcastAction =
  | BroadcastLocalTransactionRequestedAction
  | BroadcastTransactionSucceededAction
  | BroadcastWeb3TransactionRequestedAction
  | BroadcastTransactionQueuedAction
  | BroadcastTransactionFailedAction;

type TransactionAction =
  | ResetAction
  | FieldAction
  | MetaAction
  | NetworkAction
  | SignAction
  | BroadcastAction;
