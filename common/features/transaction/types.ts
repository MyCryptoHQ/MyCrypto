import EthTx from 'ethereumjs-tx';

import { Wei, TokenValue } from 'libs/units';
import { IHexStrTransaction } from 'libs/transaction';
import { BroadcastAction } from './broadcast/types';
import {
  FieldAction,
  InputFieldAction,
  SetToFieldAction,
  SetValueFieldAction,
  SetDataFieldAction
} from './fields/types';
import { MetaAction, SetTokenToMetaAction, SetTokenValueMetaAction } from './meta/types';
import { NetworkAction } from './network/types';

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

export interface SetCurrentValueAction {
  type: TypeKeys.CURRENT_VALUE_SET;
  payload: string;
}

export interface SetCurrentToAction {
  type: TypeKeys.CURRENT_TO_SET;
  payload: string;
}

export type CurrentAction = SetCurrentValueAction | SetCurrentToAction;

//#region Network
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
