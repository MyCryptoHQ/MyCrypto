import { SetGasEstimatesAction, GasAction, GAS, GasState } from './types';

export const INITIAL_STATE: GasState = {
  estimates: null,
  isEstimating: false
};

function fetchGasEstimates(state: GasState): GasState {
  return {
    ...state,
    isEstimating: true
  };
}

function setGasEstimates(state: GasState, action: SetGasEstimatesAction): GasState {
  return {
    ...state,
    estimates: action.payload,
    isEstimating: false
  };
}

export function gasReducer(state: GasState = INITIAL_STATE, action: GasAction): GasState {
  switch (action.type) {
    case GAS.FETCH_ESTIMATES:
      return fetchGasEstimates(state);
    case GAS.SET_ESTIMATES:
      return setGasEstimates(state, action);
    default:
      return state;
  }
}
