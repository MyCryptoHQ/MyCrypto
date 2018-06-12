import {
  TRANSACTION_NETWORK,
  EstimateGasFailedAction,
  EstimateGasRequestedAction,
  EstimateGasTimeoutAction,
  EstimateGasSucceededAction,
  GetFromRequestedAction,
  GetFromSucceededAction,
  GetFromFailedAction,
  GetNonceRequestedAction,
  GetNonceSucceededAction,
  GetNonceFailedAction
} from './types';

export type TEstimateGasRequested = typeof estimateGasRequested;
export const estimateGasRequested = (
  payload: EstimateGasRequestedAction['payload']
): EstimateGasRequestedAction => ({
  type: TRANSACTION_NETWORK.ESTIMATE_GAS_REQUESTED,
  payload
});

export type TEstimateGasSucceeded = typeof estimateGasSucceeded;
export const estimateGasSucceeded = (): EstimateGasSucceededAction => ({
  type: TRANSACTION_NETWORK.ESTIMATE_GAS_SUCCEEDED
});

export type TEstimateGasFailed = typeof estimateGasFailed;
export const estimateGasFailed = (): EstimateGasFailedAction => ({
  type: TRANSACTION_NETWORK.ESTIMATE_GAS_FAILED
});

export type TEstimateGasTimedout = typeof estimateGasTimedout;
export const estimateGasTimedout = (): EstimateGasTimeoutAction => ({
  type: TRANSACTION_NETWORK.ESTIMATE_GAS_TIMEDOUT
});

export type TGetFromRequested = typeof getFromRequested;
export const getFromRequested = (): GetFromRequestedAction => ({
  type: TRANSACTION_NETWORK.GET_FROM_REQUESTED
});

export type TGetFromSucceeded = typeof getFromSucceeded;
export const getFromSucceeded = (
  payload: GetFromSucceededAction['payload']
): GetFromSucceededAction => ({
  type: TRANSACTION_NETWORK.GET_FROM_SUCCEEDED,
  payload
});

export type TGetFromFailed = typeof getFromFailed;
export const getFromFailed = (): GetFromFailedAction => ({
  type: TRANSACTION_NETWORK.GET_FROM_FAILED
});

export type TGetNonceRequested = typeof getNonceRequested;
export const getNonceRequested = (): GetNonceRequestedAction => ({
  type: TRANSACTION_NETWORK.GET_NONCE_REQUESTED
});

export type TGetNonceSucceeded = typeof getNonceSucceeded;
export const getNonceSucceeded = (
  payload: GetNonceSucceededAction['payload']
): GetNonceSucceededAction => ({ type: TRANSACTION_NETWORK.GET_NONCE_SUCCEEDED, payload });

export type TGetNonceFailed = typeof getNonceFailed;
export const getNonceFailed = (): GetNonceFailedAction => ({
  type: TRANSACTION_NETWORK.GET_NONCE_FAILED
});
