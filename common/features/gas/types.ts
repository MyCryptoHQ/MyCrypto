import { GasEstimates } from 'api/gas';

export interface GasState {
  estimates: GasEstimates | null;
  isEstimating: boolean;
}

export enum GasActions {
  FETCH_ESTIMATES = 'GAS_FETCH_ESTIMATES',
  SET_ESTIMATES = 'GAS_SET_ESTIMATES'
}

export interface FetchGasEstimatesAction {
  type: GasActions.FETCH_ESTIMATES;
}

export interface SetGasEstimatesAction {
  type: GasActions.SET_ESTIMATES;
  payload: GasEstimates;
}

/*** Union Type ***/
export type GasAction = FetchGasEstimatesAction | SetGasEstimatesAction;
