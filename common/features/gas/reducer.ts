import * as gasTypes from './types';

export const INITIAL_STATE: gasTypes.GasState = {
  estimates: null,
  isEstimating: false
};

function fetchGasEstimates(state: gasTypes.GasState): gasTypes.GasState {
  return {
    ...state,
    isEstimating: true
  };
}

function setGasEstimates(
  state: gasTypes.GasState,
  action: gasTypes.SetGasEstimatesAction
): gasTypes.GasState {
  return {
    ...state,
    estimates: action.payload,
    isEstimating: false
  };
}

export function gasReducer(
  state: gasTypes.GasState = INITIAL_STATE,
  action: gasTypes.GasAction
): gasTypes.GasState {
  switch (action.type) {
    case gasTypes.GasActions.FETCH_ESTIMATES:
      return fetchGasEstimates(state);
    case gasTypes.GasActions.SET_ESTIMATES:
      return setGasEstimates(state, action);
    default:
      return state;
  }
}
