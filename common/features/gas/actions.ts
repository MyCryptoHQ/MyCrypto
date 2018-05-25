import { GAS, FetchGasEstimatesAction, SetGasEstimatesAction } from './types';

export type TFetchGasEstimates = typeof fetchGasEstimates;
export function fetchGasEstimates(): FetchGasEstimatesAction {
  return {
    type: GAS.FETCH_ESTIMATES
  };
}

export type TSetGasEstimates = typeof setGasEstimates;
export function setGasEstimates(payload: SetGasEstimatesAction['payload']): SetGasEstimatesAction {
  return {
    type: GAS.SET_ESTIMATES,
    payload
  };
}

export default {
  fetchGasEstimates,
  setGasEstimates
};
