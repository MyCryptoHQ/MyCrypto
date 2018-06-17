import * as types from './types';

export type TEstimateGasRequested = typeof estimateGasRequested;
export const estimateGasRequested = (
  payload: types.EstimateGasRequestedAction['payload']
): types.EstimateGasRequestedAction => ({
  type: types.TransactionNetworkActions.ESTIMATE_GAS_REQUESTED,
  payload
});

export type TEstimateGasSucceeded = typeof estimateGasSucceeded;
export const estimateGasSucceeded = (): types.EstimateGasSucceededAction => ({
  type: types.TransactionNetworkActions.ESTIMATE_GAS_SUCCEEDED
});

export type TEstimateGasFailed = typeof estimateGasFailed;
export const estimateGasFailed = (): types.EstimateGasFailedAction => ({
  type: types.TransactionNetworkActions.ESTIMATE_GAS_FAILED
});

export type TEstimateGasTimedout = typeof estimateGasTimedout;
export const estimateGasTimedout = (): types.EstimateGasTimeoutAction => ({
  type: types.TransactionNetworkActions.ESTIMATE_GAS_TIMEDOUT
});

export type TGetFromRequested = typeof getFromRequested;
export const getFromRequested = (): types.GetFromRequestedAction => ({
  type: types.TransactionNetworkActions.GET_FROM_REQUESTED
});

export type TGetFromSucceeded = typeof getFromSucceeded;
export const getFromSucceeded = (
  payload: types.GetFromSucceededAction['payload']
): types.GetFromSucceededAction => ({
  type: types.TransactionNetworkActions.GET_FROM_SUCCEEDED,
  payload
});

export type TGetFromFailed = typeof getFromFailed;
export const getFromFailed = (): types.GetFromFailedAction => ({
  type: types.TransactionNetworkActions.GET_FROM_FAILED
});

export type TGetNonceRequested = typeof getNonceRequested;
export const getNonceRequested = (): types.GetNonceRequestedAction => ({
  type: types.TransactionNetworkActions.GET_NONCE_REQUESTED
});

export type TGetNonceSucceeded = typeof getNonceSucceeded;
export const getNonceSucceeded = (
  payload: types.GetNonceSucceededAction['payload']
): types.GetNonceSucceededAction => ({
  type: types.TransactionNetworkActions.GET_NONCE_SUCCEEDED,
  payload
});

export type TGetNonceFailed = typeof getNonceFailed;
export const getNonceFailed = (): types.GetNonceFailedAction => ({
  type: types.TransactionNetworkActions.GET_NONCE_FAILED
});
