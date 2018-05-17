import { GasEstimates } from 'api/gas';

export enum TypeKeys {
  GAS_FETCH_ESTIMATES = 'GAS_FETCH_ESTIMATES',
  GAS_SET_ESTIMATES = 'GAS_SET_ESTIMATES'
}

export interface FetchGasEstimatesAction {
  type: TypeKeys.GAS_FETCH_ESTIMATES;
}

export interface SetGasEstimatesAction {
  type: TypeKeys.GAS_SET_ESTIMATES;
  payload: GasEstimates;
}

/*** Union Type ***/
export type GasAction = FetchGasEstimatesAction | SetGasEstimatesAction;
