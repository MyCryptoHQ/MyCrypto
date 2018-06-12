import { IHexStrTransaction } from 'libs/transaction';
import { TRANSACTION } from '../types';

export interface EstimateGasRequestedAction {
  type: TRANSACTION.ESTIMATE_GAS_REQUESTED;
  payload: Partial<IHexStrTransaction>;
}
export interface EstimateGasSucceededAction {
  type: TRANSACTION.ESTIMATE_GAS_SUCCEEDED;
}
export interface EstimateGasFailedAction {
  type: TRANSACTION.ESTIMATE_GAS_FAILED;
}
export interface EstimateGasTimeoutAction {
  type: TRANSACTION.ESTIMATE_GAS_TIMEDOUT;
}
export interface GetFromRequestedAction {
  type: TRANSACTION.GET_FROM_REQUESTED;
}
export interface GetFromSucceededAction {
  type: TRANSACTION.GET_FROM_SUCCEEDED;
  payload: string;
}
export interface GetFromFailedAction {
  type: TRANSACTION.GET_FROM_FAILED;
}
export interface GetNonceRequestedAction {
  type: TRANSACTION.GET_NONCE_REQUESTED;
}
export interface GetNonceSucceededAction {
  type: TRANSACTION.GET_NONCE_SUCCEEDED;
  payload: string;
}
export interface GetNonceFailedAction {
  type: TRANSACTION.GET_NONCE_FAILED;
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
