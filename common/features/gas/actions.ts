import { TypeKeys, FetchGasEstimatesAction, SetGasEstimatesAction } from './types';

export type TFetchGasEstimates = typeof fetchGasEstimates;
export function fetchGasEstimates(): FetchGasEstimatesAction {
  return {
    type: TypeKeys.GAS_FETCH_ESTIMATES
  };
}

export type TSetGasEstimates = typeof setGasEstimates;
export function setGasEstimates(payload: SetGasEstimatesAction['payload']): SetGasEstimatesAction {
  return {
    type: TypeKeys.GAS_SET_ESTIMATES,
    payload
  };
}

export default {
  fetchGasEstimates,
  setGasEstimates
};
