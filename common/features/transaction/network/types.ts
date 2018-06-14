import { IHexStrTransaction } from 'libs/transaction';

export enum TRANSACTION_NETWORK {
  ESTIMATE_GAS_REQUESTED = 'ESTIMATE_GAS_REQUESTED',
  ESTIMATE_GAS_SUCCEEDED = 'ESTIMATE_GAS_SUCCEEDED',
  ESTIMATE_GAS_FAILED = 'ESTIMATE_GAS_FAILED',
  ESTIMATE_GAS_TIMEDOUT = 'ESTIMATE_GAS_TIMEDOUT',
  GET_FROM_REQUESTED = 'GET_FROM_REQUESTED',
  GET_FROM_SUCCEEDED = 'GET_FROM_SUCCEEDED',
  GET_FROM_FAILED = 'GET_FROM_FAILED',
  GET_NONCE_REQUESTED = 'GET_NONCE_REQUESTED',
  GET_NONCE_SUCCEEDED = 'GET_NONCE_SUCCEEDED',
  GET_NONCE_FAILED = 'GET_NONCE_FAILED'
}

export interface NetworkState {
  gasEstimationStatus: RequestStatus | null;
  getFromStatus: RequestStatus | null;
  getNonceStatus: RequestStatus | null;
  gasPriceStatus: RequestStatus | null;
}

export interface EstimateGasRequestedAction {
  type: TRANSACTION_NETWORK.ESTIMATE_GAS_REQUESTED;
  payload: Partial<IHexStrTransaction>;
}

export interface EstimateGasSucceededAction {
  type: TRANSACTION_NETWORK.ESTIMATE_GAS_SUCCEEDED;
}

export interface EstimateGasFailedAction {
  type: TRANSACTION_NETWORK.ESTIMATE_GAS_FAILED;
}

export interface EstimateGasTimeoutAction {
  type: TRANSACTION_NETWORK.ESTIMATE_GAS_TIMEDOUT;
}

export interface GetFromRequestedAction {
  type: TRANSACTION_NETWORK.GET_FROM_REQUESTED;
}

export interface GetFromSucceededAction {
  type: TRANSACTION_NETWORK.GET_FROM_SUCCEEDED;
  payload: string;
}
export interface GetFromFailedAction {
  type: TRANSACTION_NETWORK.GET_FROM_FAILED;
}

export interface GetNonceRequestedAction {
  type: TRANSACTION_NETWORK.GET_NONCE_REQUESTED;
}

export interface GetNonceSucceededAction {
  type: TRANSACTION_NETWORK.GET_NONCE_SUCCEEDED;
  payload: string;
}

export interface GetNonceFailedAction {
  type: TRANSACTION_NETWORK.GET_NONCE_FAILED;
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
