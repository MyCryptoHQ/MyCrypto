import { SetGasEstimatesAction, GasAction, TypeKeys } from 'actions/gas';
import { GasEstimates } from 'api/gas';

export interface State {
  estimates: GasEstimates | null;
  isEstimating: boolean;
}

export const INITIAL_STATE: State = {
  estimates: null,
  isEstimating: false
};

function fetchGasEstimates(state: State): State {
  return {
    ...state,
    isEstimating: true
  };
}

function setGasEstimates(state: State, action: SetGasEstimatesAction): State {
  return {
    ...state,
    estimates: action.payload,
    isEstimating: false
  };
}

export function gas(state: State = INITIAL_STATE, action: GasAction): State {
  switch (action.type) {
    case TypeKeys.GAS_FETCH_ESTIMATES:
      return fetchGasEstimates(state);
    case TypeKeys.GAS_SET_ESTIMATES:
      return setGasEstimates(state, action);
    default:
      return state;
  }
}
