import { IHexStrTransaction } from 'libs/transaction';
import { TypeKeys } from '../types';

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
