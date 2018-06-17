import * as types from './types';

export type TFetchGasEstimates = typeof fetchGasEstimates;
export function fetchGasEstimates(): types.FetchGasEstimatesAction {
  return {
    type: types.GasActions.FETCH_ESTIMATES
  };
}

export type TSetGasEstimates = typeof setGasEstimates;
export function setGasEstimates(
  payload: types.SetGasEstimatesAction['payload']
): types.SetGasEstimatesAction {
  return {
    type: types.GasActions.SET_ESTIMATES,
    payload
  };
}
