import { transactionBroadcastTypes } from './broadcast';
import { transactionFieldsTypes } from './fields';
import { transactionMetaTypes } from './meta';
import { transactionNetworkTypes } from './network';
import { transactionSignTypes } from './sign';

export enum TransactionActions {
  CURRENT_VALUE_SET = 'TRANSACTION_CURRENT_VALUE_SET',
  CURRENT_TO_SET = 'TRANSACTION_CURRENT_TO_SET',
  TOKEN_TO_ETHER_SWAP = 'TRANSACTION_TOKEN_TO_ETHER_SWAP',
  ETHER_TO_TOKEN_SWAP = 'TRANSACTION_ETHER_TO_TOKEN_SWAP',
  TOKEN_TO_TOKEN_SWAP = 'TRANSACTION_TOKEN_TO_TOKEN_SWAP',
  SEND_EVERYTHING_REQUESTED = 'TRANSACTION_SEND_EVERYTHING_REQUESTED',
  SEND_EVERYTHING_SUCCEEDED = 'TRANSACTION_SEND_EVERYTHING_SUCCEEDED',
  SEND_EVERYTHING_FAILED = 'TRANSACTION_SEND_EVERYTHING_FAILED',
  RESET_REQUESTED = 'TRANSACTION_RESET_REQUESTED',
  RESET_SUCCESSFUL = 'TRANSACTION_RESET_SUCCESSFUL'
}

export interface TransactionState {
  broadcast: transactionBroadcastTypes.TransactionBroadcastState;
  fields: transactionFieldsTypes.TransactionFieldsState;
  meta: transactionMetaTypes.TransactionMetaState;
  network: transactionNetworkTypes.TransactionNetworkState;
  sign: transactionSignTypes.TransactionSignState;
}

export interface SetCurrentValueAction {
  type: TransactionActions.CURRENT_VALUE_SET;
  payload: string;
}

export interface SetCurrentToAction {
  type: TransactionActions.CURRENT_TO_SET;
  payload: string;
}

export type CurrentAction = SetCurrentValueAction | SetCurrentToAction;

//#region Send Everything
export interface SendEverythingRequestedAction {
  type: TransactionActions.SEND_EVERYTHING_REQUESTED;
}
export interface SendEverythingSucceededAction {
  type: TransactionActions.SEND_EVERYTHING_SUCCEEDED;
}
export interface SendEverythingFailedAction {
  type: TransactionActions.SEND_EVERYTHING_FAILED;
}

export type SendEverythingAction =
  | SendEverythingRequestedAction
  | SendEverythingSucceededAction
  | SendEverythingFailedAction;
//#endregion Send Everything

//#region Swap
export interface SwapTokenToEtherAction {
  type: TransactionActions.TOKEN_TO_ETHER_SWAP;
  payload: {
    to: transactionFieldsTypes.SetToFieldAction['payload'];
    value: transactionFieldsTypes.SetValueFieldAction['payload'];
    decimal: number;
  };
}
export interface SwapEtherToTokenAction {
  type: TransactionActions.ETHER_TO_TOKEN_SWAP;
  payload: {
    to: transactionFieldsTypes.SetToFieldAction['payload'];
    data: transactionFieldsTypes.SetDataFieldAction['payload'];
    tokenTo: transactionMetaTypes.SetTokenToMetaAction['payload'];
    tokenValue: transactionMetaTypes.SetTokenValueMetaAction['payload'];
    decimal: number;
  };
}
export interface SwapTokenToTokenAction {
  type: TransactionActions.TOKEN_TO_TOKEN_SWAP;
  payload: {
    to: transactionFieldsTypes.SetToFieldAction['payload'];
    data: transactionFieldsTypes.SetDataFieldAction['payload'];
    tokenValue: transactionMetaTypes.SetTokenValueMetaAction['payload'];
    decimal: number;
  };
}
export type SwapAction = SwapEtherToTokenAction | SwapTokenToEtherAction | SwapTokenToTokenAction;
//#endregion Swap

export interface ResetTransactionRequestedAction {
  type: TransactionActions.RESET_REQUESTED;
}

export interface ResetTransactionSuccessfulAction {
  type: TransactionActions.RESET_SUCCESSFUL;
  payload: { isContractInteraction: boolean };
}

export type TransactionAction =
  | transactionBroadcastTypes.TransactionBroadcastAction
  | transactionFieldsTypes.InputFieldAction
  | transactionFieldsTypes.TransactionFieldAction
  | transactionMetaTypes.TransactionMetaAction
  | transactionNetworkTypes.TransactionNetworkAction
  | transactionSignTypes.TransactionSignAction
  | SwapAction
  | ResetTransactionRequestedAction
  | ResetTransactionSuccessfulAction
  | CurrentAction
  | SendEverythingAction;
