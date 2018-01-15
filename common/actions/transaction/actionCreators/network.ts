import {
  TypeKeys,
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
} from 'actions/transaction';

type TEstimateGasRequested = typeof estimateGasRequested;
const estimateGasRequested = (
  payload: EstimateGasRequestedAction['payload']
): EstimateGasRequestedAction => ({
  type: TypeKeys.ESTIMATE_GAS_REQUESTED,
  payload
});

type TEstimateGasSucceeded = typeof estimateGasSucceeded;
const estimateGasSucceeded = (): EstimateGasSucceededAction => ({
  type: TypeKeys.ESTIMATE_GAS_SUCCEEDED
});

type TEstimateGasFailed = typeof estimateGasFailed;
const estimateGasFailed = (): EstimateGasFailedAction => ({
  type: TypeKeys.ESTIMATE_GAS_FAILED
});

type TEstimateGasTimedout = typeof estimateGasTimedout;
const estimateGasTimedout = (): EstimateGasTimeoutAction => ({
  type: TypeKeys.ESTIMATE_GAS_TIMEDOUT
});

type TGetFromRequested = typeof getFromRequested;
const getFromRequested = (): GetFromRequestedAction => ({
  type: TypeKeys.GET_FROM_REQUESTED
});

type TGetFromSucceeded = typeof getFromSucceeded;
const getFromSucceeded = (payload: GetFromSucceededAction['payload']): GetFromSucceededAction => ({
  type: TypeKeys.GET_FROM_SUCCEEDED,
  payload
});

type TGetFromFailed = typeof getFromFailed;
const getFromFailed = (): GetFromFailedAction => ({
  type: TypeKeys.GET_FROM_FAILED
});

type TGetNonceRequested = typeof getNonceRequested;
const getNonceRequested = (): GetNonceRequestedAction => ({
  type: TypeKeys.GET_NONCE_REQUESTED
});

type TGetNonceSucceeded = typeof getNonceSucceeded;
const getNonceSucceeded = (
  payload: GetNonceSucceededAction['payload']
): GetNonceSucceededAction => ({ type: TypeKeys.GET_NONCE_SUCCEEDED, payload });

type TGetNonceFailed = typeof getNonceFailed;
const getNonceFailed = (): GetNonceFailedAction => ({
  type: TypeKeys.GET_NONCE_FAILED
});

export {
  estimateGasRequested,
  estimateGasFailed,
  estimateGasTimedout,
  estimateGasSucceeded,
  getFromRequested,
  getFromSucceeded,
  getFromFailed,
  getNonceRequested,
  getNonceFailed,
  getNonceSucceeded,
  TEstimateGasRequested,
  TEstimateGasFailed,
  TEstimateGasSucceeded,
  TEstimateGasTimedout,
  TGetFromRequested,
  TGetFromSucceeded,
  TGetNonceRequested,
  TGetNonceSucceeded,
  TGetNonceFailed,
  TGetFromFailed
};
