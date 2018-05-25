import EthTx from 'ethereumjs-tx';
import { Wei, Data, Address, Nonce, TokenValue } from 'libs/units';
import { IHexStrTransaction } from 'libs/transaction';

export enum TypeKeys {
  ESTIMATE_GAS_REQUESTED = 'ESTIMATE_GAS_REQUESTED',
  ESTIMATE_GAS_SUCCEEDED = 'ESTIMATE_GAS_SUCCEEDED',
  ESTIMATE_GAS_FAILED = 'ESTIMATE_GAS_FAILED',
  ESTIMATE_GAS_TIMEDOUT = 'ESTIMATE_GAS_TIMEDOUT',
  GET_FROM_REQUESTED = 'GET_FROM_REQUESTED',
  GET_FROM_SUCCEEDED = 'GET_FROM_SUCCEEDED',
  GET_FROM_FAILED = 'GET_FROM_FAILED',
  GET_NONCE_REQUESTED = 'GET_NONCE_REQUESTED',
  GET_NONCE_SUCCEEDED = 'GET_NONCE_SUCCEEDED',
  GET_NONCE_FAILED = 'GET_NONCE_FAILED',
  SIGN_TRANSACTION_REQUESTED = 'SIGN_TRANSACTION_REQUESTED',
  SIGN_WEB3_TRANSACTION_SUCCEEDED = 'SIGN_WEB3_TRANSACTION_SUCCEEDED',
  SIGN_LOCAL_TRANSACTION_SUCCEEDED = 'SIGN_LOCAL_TRANSACTION_SUCCEEDED',
  SIGN_TRANSACTION_FAILED = 'SIGN_TRANSACTION_FAILED',
  BROADCAST_WEB3_TRANSACTION_REQUESTED = 'BROADCAST_WEB3_TRANSACTION_REQUESTED',
  BROADCAST_TRANSACTION_SUCCEEDED = 'BROADCAST_TRANSACTION_SUCCEEDED',
  BROADCAST_LOCAL_TRANSACTION_REQUESTED = 'BROADCAST_LOCAL_TRANSACTION_REQUESTED',
  BROADCAST_TRANSACTION_QUEUED = 'BROADCAST_TRANSACTION_QUEUED',
  BROADCAST_TRASACTION_FAILED = 'BROADCAST_TRASACTION_FAILED',
  CURRENT_VALUE_SET = 'CURRENT_VALUE_SET',
  CURRENT_TO_SET = 'CURRENT_TO_SET',
  DATA_FIELD_INPUT = 'DATA_FIELD_INPUT',
  GAS_LIMIT_INPUT = 'GAS_LIMIT_INPUT',
  GAS_PRICE_INPUT = 'GAS_PRICE_INPUT',
  GAS_PRICE_INPUT_INTENT = 'GAS_PRICE_INPUT_INTENT',
  NONCE_INPUT = 'NONCE_INPUT',
  DATA_FIELD_SET = 'DATA_FIELD_SET',
  GAS_LIMIT_FIELD_SET = 'GAS_LIMIT_FIELD_SET',
  TO_FIELD_SET = 'TO_FIELD_SET',
  VALUE_FIELD_SET = 'VALUE_FIELD_SET',
  NONCE_FIELD_SET = 'NONCE_FIELD_SET',
  GAS_PRICE_FIELD_SET = 'GAS_PRICE_FIELD_SET',
  TOKEN_TO_META_SET = 'TOKEN_TO_META_SET',
  UNIT_META_SET = 'UNIT_META_SET',
  TOKEN_VALUE_META_SET = 'TOKEN_VALUE_META_SET',
  TOKEN_TO_ETHER_SWAP = 'TOKEN_TO_ETHER_SWAP',
  ETHER_TO_TOKEN_SWAP = 'ETHER_TO_TOKEN_SWAP',
  TOKEN_TO_TOKEN_SWAP = 'TOKEN_TO_TOKEN_SWAP',
  SEND_EVERYTHING_REQUESTED = 'SEND_EVERYTHING_REQUESTED',
  SEND_EVERYTHING_SUCCEEDED = 'SEND_EVERYTHING_SUCCEEDED',
  SEND_EVERYTHING_FAILED = 'SEND_EVERYTHING_FAILED',
  IS_CONTRACT_INTERACTION = 'IS_CONTRACT_INTERACTION',
  IS_VIEW_AND_SEND = 'IS_VIEW_AND_SEND',
  RESET_REQUESTED = 'TRANSACTION_RESET_REQUESTED',
  RESET_SUCCESSFUL = 'TRANSACTION_RESET_SUCCESSFUL'
}

//#region Broadcast
export interface BroadcastLocalTransactionRequestedAction {
  type: TypeKeys.BROADCAST_LOCAL_TRANSACTION_REQUESTED;
}
export interface BroadcastWeb3TransactionRequestedAction {
  type: TypeKeys.BROADCAST_WEB3_TRANSACTION_REQUESTED;
}
export interface BroadcastTransactionSucceededAction {
  type: TypeKeys.BROADCAST_TRANSACTION_SUCCEEDED;
  payload: { indexingHash: string; broadcastedHash: string };
}
export interface BroadcastTransactionQueuedAction {
  type: TypeKeys.BROADCAST_TRANSACTION_QUEUED;
  payload: { indexingHash: string; serializedTransaction: Buffer };
}
export interface BroadcastTransactionFailedAction {
  type: TypeKeys.BROADCAST_TRASACTION_FAILED;
  payload: { indexingHash: string };
}
export type BroadcastAction =
  | BroadcastLocalTransactionRequestedAction
  | BroadcastTransactionSucceededAction
  | BroadcastWeb3TransactionRequestedAction
  | BroadcastTransactionQueuedAction
  | BroadcastTransactionFailedAction;

export interface ITransactionStatus {
  serializedTransaction: Buffer;
  broadcastedHash: string | null;
  isBroadcasting: boolean;
  broadcastSuccessful: boolean;
}

export type BroadcastRequestedAction =
  | BroadcastWeb3TransactionRequestedAction
  | BroadcastLocalTransactionRequestedAction;

export interface ISerializedTxAndIndexingHash {
  serializedTransaction: Buffer;
  indexingHash: string;
}
//#endregion Broadcast

//#region Current
export interface SetCurrentValueAction {
  type: TypeKeys.CURRENT_VALUE_SET;
  payload: string;
}

export interface SetCurrentToAction {
  type: TypeKeys.CURRENT_TO_SET;
  payload: string;
}

export type CurrentAction = SetCurrentValueAction | SetCurrentToAction;
//#endregion Current

//#region Fields
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

//#endregion Fields

//#region Meta
export interface SetTokenToMetaAction {
  type: TypeKeys.TOKEN_TO_META_SET;
  payload: {
    raw: string;
    value: Address | null;
  };
}

export interface SetUnitMetaAction {
  type: TypeKeys.UNIT_META_SET;
  payload: string;
}

export interface SetTokenValueMetaAction {
  type: TypeKeys.TOKEN_VALUE_META_SET;
  payload: {
    raw: string;
    value: TokenValue | null;
  };
}

export interface SetAsContractInteractionAction {
  type: TypeKeys.IS_CONTRACT_INTERACTION;
}

export interface SetAsViewAndSendAction {
  type: TypeKeys.IS_VIEW_AND_SEND;
}

export type TransactionMetaAction =
  | SetUnitMetaAction
  | SetTokenValueMetaAction
  | SetTokenToMetaAction;
export type TransactionTypeMetaAction = SetAsContractInteractionAction | SetAsViewAndSendAction;

export type MetaAction = TransactionMetaAction | TransactionTypeMetaAction;
//#endregion Meta

//#region Network
export interface EstimateGasRequestedAction {
  type: TypeKeys.ESTIMATE_GAS_REQUESTED;
  payload: Partial<IHexStrTransaction>;
}
export interface EstimateGasSucceededAction {
  type: TypeKeys.ESTIMATE_GAS_SUCCEEDED;
}
export interface EstimateGasFailedAction {
  type: TypeKeys.ESTIMATE_GAS_FAILED;
}
export interface EstimateGasTimeoutAction {
  type: TypeKeys.ESTIMATE_GAS_TIMEDOUT;
}
export interface GetFromRequestedAction {
  type: TypeKeys.GET_FROM_REQUESTED;
}
export interface GetFromSucceededAction {
  type: TypeKeys.GET_FROM_SUCCEEDED;
  payload: string;
}
export interface GetFromFailedAction {
  type: TypeKeys.GET_FROM_FAILED;
}
export interface GetNonceRequestedAction {
  type: TypeKeys.GET_NONCE_REQUESTED;
}
export interface GetNonceSucceededAction {
  type: TypeKeys.GET_NONCE_SUCCEEDED;
  payload: string;
}
export interface GetNonceFailedAction {
  type: TypeKeys.GET_NONCE_FAILED;
}

export type NetworkAction =
  | EstimateGasFailedAction
  | EstimateGasRequestedAction
  | EstimateGasSucceededAction
  | EstimateGasTimeoutAction
  | GetFromRequestedAction
  | GetFromSucceededAction
  | GetFromFailedAction
  | GetNonceRequestedAction
  | GetNonceSucceededAction
  | GetNonceFailedAction;

export enum RequestStatus {
  REQUESTED = 'PENDING',
  SUCCEEDED = 'SUCCESS',
  FAILED = 'FAIL',
  TIMEDOUT = 'TIMEDOUT'
}
//#endregion Network

//#region Send Everything
export interface SendEverythingRequestedAction {
  type: TypeKeys.SEND_EVERYTHING_REQUESTED;
}
export interface SendEverythingSucceededAction {
  type: TypeKeys.SEND_EVERYTHING_SUCCEEDED;
}
export interface SendEverythingFailedAction {
  type: TypeKeys.SEND_EVERYTHING_FAILED;
}

export type SendEverythingAction =
  | SendEverythingRequestedAction
  | SendEverythingSucceededAction
  | SendEverythingFailedAction;
//#endregion Send Everything

//#region Sign
export interface SignTransactionRequestedAction {
  type: TypeKeys.SIGN_TRANSACTION_REQUESTED;
  payload: EthTx;
}
export interface SignLocalTransactionSucceededAction {
  type: TypeKeys.SIGN_LOCAL_TRANSACTION_SUCCEEDED;
  payload: { signedTransaction: Buffer; indexingHash: string; noVerify?: boolean }; // dont verify against fields, for pushTx
}

export interface SignWeb3TransactionSucceededAction {
  type: TypeKeys.SIGN_WEB3_TRANSACTION_SUCCEEDED;
  payload: { transaction: Buffer; indexingHash: string; noVerify?: boolean };
}
export interface SignTransactionFailedAction {
  type: TypeKeys.SIGN_TRANSACTION_FAILED;
}

export type SignAction =
  | SignTransactionRequestedAction
  | SignLocalTransactionSucceededAction
  | SignWeb3TransactionSucceededAction
  | SignTransactionFailedAction;

export interface SerializedTxParams extends IHexStrTransaction {
  unit: string;
  currentTo: Buffer;
  currentValue: Wei | TokenValue;
  fee: Wei;
  total: Wei;
  isToken: boolean;
  decimal: number;
}
//#endregion Sign

//#region Swap
export interface SwapTokenToEtherAction {
  type: TypeKeys.TOKEN_TO_ETHER_SWAP;
  payload: {
    to: SetToFieldAction['payload'];
    value: SetValueFieldAction['payload'];
    decimal: number;
  };
}
export interface SwapEtherToTokenAction {
  type: TypeKeys.ETHER_TO_TOKEN_SWAP;
  payload: {
    to: SetToFieldAction['payload'];
    data: SetDataFieldAction['payload'];
    tokenTo: SetTokenToMetaAction['payload'];
    tokenValue: SetTokenValueMetaAction['payload'];
    decimal: number;
  };
}
export interface SwapTokenToTokenAction {
  type: TypeKeys.TOKEN_TO_TOKEN_SWAP;
  payload: {
    to: SetToFieldAction['payload'];
    data: SetDataFieldAction['payload'];
    tokenValue: SetTokenValueMetaAction['payload'];
    decimal: number;
  };
}
export type SwapAction = SwapEtherToTokenAction | SwapTokenToEtherAction | SwapTokenToTokenAction;
//#endregion Swap

export interface ResetTransactionRequestedAction {
  type: TypeKeys.RESET_REQUESTED;
}

export interface ResetTransactionSuccessfulAction {
  type: TypeKeys.RESET_SUCCESSFUL;
  payload: { isContractInteraction: boolean };
}

export type TransactionAction =
  | InputFieldAction
  | BroadcastAction
  | FieldAction
  | MetaAction
  | NetworkAction
  | SignAction
  | SwapAction
  | ResetTransactionRequestedAction
  | ResetTransactionSuccessfulAction
  | CurrentAction
  | SendEverythingAction;
