import * as types from './types';

export const INITIAL_STATE: types.ParitySignerState = {
  requested: null
};

function requestTransactionSignature(
  state: types.ParitySignerState,
  action: types.RequestTransactionSignatureAction
): types.ParitySignerState {
  return {
    ...state,
    requested: action.payload
  };
}

function requestMessageSignature(
  state: types.ParitySignerState,
  action: types.RequestMessageSignatureAction
): types.ParitySignerState {
  return {
    ...state,
    requested: action.payload
  };
}

function finalizeSignature(state: types.ParitySignerState): types.ParitySignerState {
  return {
    ...state,
    requested: null
  };
}

export function paritySignerReducer(
  state: types.ParitySignerState = INITIAL_STATE,
  action: types.ParitySignerAction
): types.ParitySignerState {
  switch (action.type) {
    case types.ParitySignerActions.REQUEST_TX_SIGNATURE:
      return requestTransactionSignature(state, action);
    case types.ParitySignerActions.REQUEST_MSG_SIGNATURE:
      return requestMessageSignature(state, action);
    case types.ParitySignerActions.FINALIZE_SIGNATURE:
      return finalizeSignature(state);
    default:
      return state;
  }
}
