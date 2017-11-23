import {
  EstimateGasFailedAction,
  EstimateGasRequestedAction,
  TypeKeys,
  EstimateGasSucceededAction
} from 'actions/transaction';
export {
  estimateGasRequested,
  estimateGasFailed,
  estimateGasSucceeded,
  TEstimateGasRequested,
  TEstimateGasFailed,
  TEstimateGasSucceeded
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
