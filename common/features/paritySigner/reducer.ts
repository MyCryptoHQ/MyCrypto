import * as paritySignerTypes from './types';

export const INITIAL_STATE: paritySignerTypes.ParitySignerState = {
  requested: null
};

function requestTransactionSignature(
  state: paritySignerTypes.ParitySignerState,
  action: paritySignerTypes.RequestTransactionSignatureAction
): paritySignerTypes.ParitySignerState {
  return {
    ...state,
    requested: action.payload
  };
}

function requestMessageSignature(
  state: paritySignerTypes.ParitySignerState,
  action: paritySignerTypes.RequestMessageSignatureAction
): paritySignerTypes.ParitySignerState {
  return {
    ...state,
    requested: action.payload
  };
}

function finalizeSignature(
  state: paritySignerTypes.ParitySignerState
): paritySignerTypes.ParitySignerState {
  return {
    ...state,
    requested: null
  };
}

export function paritySignerReducer(
  state: paritySignerTypes.ParitySignerState = INITIAL_STATE,
  action: paritySignerTypes.ParitySignerAction
): paritySignerTypes.ParitySignerState {
  switch (action.type) {
    case paritySignerTypes.ParitySignerActions.REQUEST_TX_SIGNATURE:
      return requestTransactionSignature(state, action);
    case paritySignerTypes.ParitySignerActions.REQUEST_MSG_SIGNATURE:
      return requestMessageSignature(state, action);
    case paritySignerTypes.ParitySignerActions.FINALIZE_SIGNATURE:
      return finalizeSignature(state);
    default:
      return state;
  }
}
