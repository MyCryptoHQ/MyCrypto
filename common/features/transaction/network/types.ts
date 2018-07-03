import { IHexStrTransaction } from 'libs/transaction';

export enum TransactionNetworkActions {
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

export interface TransactionNetworkState {
  gasEstimationStatus: RequestStatus | null;
  getFromStatus: RequestStatus | null;
  getNonceStatus: RequestStatus | null;
  gasPriceStatus: RequestStatus | null;
}

export interface EstimateGasRequestedAction {
  type: TransactionNetworkActions.ESTIMATE_GAS_REQUESTED;
  payload: Partial<IHexStrTransaction>;
}

export interface EstimateGasSucceededAction {
  type: TransactionNetworkActions.ESTIMATE_GAS_SUCCEEDED;
}

export interface EstimateGasFailedAction {
  type: TransactionNetworkActions.ESTIMATE_GAS_FAILED;
}

export interface EstimateGasTimeoutAction {
  type: TransactionNetworkActions.ESTIMATE_GAS_TIMEDOUT;
}

export interface GetFromRequestedAction {
  type: TransactionNetworkActions.GET_FROM_REQUESTED;
}

export interface GetFromSucceededAction {
  type: TransactionNetworkActions.GET_FROM_SUCCEEDED;
  payload: string;
}
export interface GetFromFailedAction {
  type: TransactionNetworkActions.GET_FROM_FAILED;
}

export interface GetNonceRequestedAction {
  type: TransactionNetworkActions.GET_NONCE_REQUESTED;
}

export interface GetNonceSucceededAction {
  type: TransactionNetworkActions.GET_NONCE_SUCCEEDED;
  payload: string;
}

export interface GetNonceFailedAction {
  type: TransactionNetworkActions.GET_NONCE_FAILED;
}

export type TransactionNetworkAction =
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
