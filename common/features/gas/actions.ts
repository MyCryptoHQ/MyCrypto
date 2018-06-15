import * as gasTypes from './types';

export type TFetchGasEstimates = typeof fetchGasEstimates;
export function fetchGasEstimates(): gasTypes.FetchGasEstimatesAction {
  return {
    type: gasTypes.GasActions.FETCH_ESTIMATES
  };
}

export type TSetGasEstimates = typeof setGasEstimates;
export function setGasEstimates(
  payload: gasTypes.SetGasEstimatesAction['payload']
): gasTypes.SetGasEstimatesAction {
  return {
    type: gasTypes.GasActions.SET_ESTIMATES,
    payload
  };
}
