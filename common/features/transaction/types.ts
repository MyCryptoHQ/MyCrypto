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
  CURRENT_VALUE_SET = 'CURRENT_VALUE_SET',
  CURRENT_TO_SET = 'CURRENT_TO_SET',
  TOKEN_TO_ETHER_SWAP = 'TOKEN_TO_ETHER_SWAP',
  ETHER_TO_TOKEN_SWAP = 'ETHER_TO_TOKEN_SWAP',
  TOKEN_TO_TOKEN_SWAP = 'TOKEN_TO_TOKEN_SWAP',
  SEND_EVERYTHING_REQUESTED = 'SEND_EVERYTHING_REQUESTED',
  SEND_EVERYTHING_SUCCEEDED = 'SEND_EVERYTHING_SUCCEEDED',
  SEND_EVERYTHING_FAILED = 'SEND_EVERYTHING_FAILED',
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
