import {
  EstimateGasFailedAction,
  EstimateGasRequestedAction,
  TypeKeys,
  EstimateGasSucceededAction,
  GetFromRequestedAction,
  GetFromSucceededAction,
  GetFromFailedAction
} from 'actions/transaction';
export {
  estimateGasRequested,
  estimateGasFailed,
  estimateGasSucceeded,
  getFromRequested,
  getFromSucceeded,
  getFromFailed,
  TEstimateGasRequested,
  TEstimateGasFailed,
  TEstimateGasSucceeded,
  TGetFromRequested,
  TGetFromSucceeded,
  TGetFromFailed
};

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

type TGetFromRequested = typeof getFromRequested;
const getFromRequested = (): GetFromRequestedAction => ({
  type: TypeKeys.GET_FROM_REQUESTED
});

type TGetFromSucceeded = typeof getFromSucceeded;
const getFromSucceeded = (
  payload: GetFromSucceededAction['payload']
): GetFromSucceededAction => ({ type: TypeKeys.GET_FROM_SUCCEEDED, payload });

type TGetFromFailed = typeof getFromFailed;
const getFromFailed = (): GetFromFailedAction => ({
  type: TypeKeys.GET_FROM_FAILED
});
