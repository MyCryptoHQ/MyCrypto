import * as types from './types';

export const INITIAL_STATE: types.GasState = {
  estimates: null,
  isEstimating: false
};

function fetchGasEstimates(state: types.GasState): types.GasState {
  return {
    ...state,
    isEstimating: true
  };
}

function setGasEstimates(
  state: types.GasState,
  action: types.SetGasEstimatesAction
): types.GasState {
  return {
    ...state,
    estimates: action.payload,
    isEstimating: false
  };
}

export function gasReducer(
  state: types.GasState = INITIAL_STATE,
  action: types.GasAction
): types.GasState {
  switch (action.type) {
    case types.GasActions.FETCH_ESTIMATES:
      return fetchGasEstimates(state);
    case types.GasActions.SET_ESTIMATES:
      return setGasEstimates(state, action);
    default:
      return state;
  }
}
