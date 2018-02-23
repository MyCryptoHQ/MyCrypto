import { TypeKeys } from './constants';
import { GasEstimates } from 'api/gas';

export interface FetchGasEstimatesAction {
  type: TypeKeys.GAS_FETCH_ESTIMATES;
}

export interface SetGasEstimatesAction {
  type: TypeKeys.GAS_SET_ESTIMATES;
  payload: GasEstimates;
}

/*** Union Type ***/
export type GasAction = FetchGasEstimatesAction | SetGasEstimatesAction;
