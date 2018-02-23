import * as interfaces from './actionTypes';
import { TypeKeys } from './constants';

export type TFetchGasEstimates = typeof fetchGasEstimates;
export function fetchGasEstimates(): interfaces.FetchGasEstimatesAction {
  return {
    type: TypeKeys.GAS_FETCH_ESTIMATES
  };
}

export type TSetGasEstimates = typeof setGasEstimates;
export function setGasEstimates(
  payload: interfaces.SetGasEstimatesAction['payload']
): interfaces.SetGasEstimatesAction {
  return {
    type: TypeKeys.GAS_SET_ESTIMATES,
    payload
  };
}
