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
import { SignAction } from './sign/types';

export enum TRANSACTION {
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
  CURRENT_VALUE_SET = 'CURRENT_VALUE_SET',
  CURRENT_TO_SET = 'CURRENT_TO_SET',
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
  type: TRANSACTION.CURRENT_VALUE_SET;
  payload: string;
}

export interface SetCurrentToAction {
  type: TRANSACTION.CURRENT_TO_SET;
  payload: string;
}

export type CurrentAction = SetCurrentValueAction | SetCurrentToAction;

//#region Send Everything
export interface SendEverythingRequestedAction {
  type: TRANSACTION.SEND_EVERYTHING_REQUESTED;
}
export interface SendEverythingSucceededAction {
  type: TRANSACTION.SEND_EVERYTHING_SUCCEEDED;
}
export interface SendEverythingFailedAction {
  type: TRANSACTION.SEND_EVERYTHING_FAILED;
}

export type SendEverythingAction =
  | SendEverythingRequestedAction
  | SendEverythingSucceededAction
  | SendEverythingFailedAction;
//#endregion Send Everything

//#region Swap
export interface SwapTokenToEtherAction {
  type: TRANSACTION.TOKEN_TO_ETHER_SWAP;
  payload: {
    to: SetToFieldAction['payload'];
    value: SetValueFieldAction['payload'];
    decimal: number;
  };
}
export interface SwapEtherToTokenAction {
  type: TRANSACTION.ETHER_TO_TOKEN_SWAP;
  payload: {
    to: SetToFieldAction['payload'];
    data: SetDataFieldAction['payload'];
    tokenTo: SetTokenToMetaAction['payload'];
    tokenValue: SetTokenValueMetaAction['payload'];
    decimal: number;
  };
}
export interface SwapTokenToTokenAction {
  type: TRANSACTION.TOKEN_TO_TOKEN_SWAP;
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
  type: TRANSACTION.RESET_REQUESTED;
}

export interface ResetTransactionSuccessfulAction {
  type: TRANSACTION.RESET_SUCCESSFUL;
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
