import {
  PARITY_SIGNER,
  ParitySignerAction,
  RequestTransactionSignatureAction,
  RequestMessageSignatureAction,
  ParitySignerState
} from './types';

export const INITIAL_STATE: ParitySignerState = {
  requested: null
};

function requestTransactionSignature(
  state: ParitySignerState,
  action: RequestTransactionSignatureAction
): ParitySignerState {
  return {
    ...state,
    requested: action.payload
  };
}

function requestMessageSignature(
  state: ParitySignerState,
  action: RequestMessageSignatureAction
): ParitySignerState {
  return {
    ...state,
    requested: action.payload
  };
}

function finalizeSignature(state: ParitySignerState): ParitySignerState {
  return {
    ...state,
    requested: null
  };
}

export function paritySignerReducer(
  state: ParitySignerState = INITIAL_STATE,
  action: ParitySignerAction
): ParitySignerState {
  switch (action.type) {
    case PARITY_SIGNER.REQUEST_TX_SIGNATURE:
      return requestTransactionSignature(state, action);
    case PARITY_SIGNER.REQUEST_MSG_SIGNATURE:
      return requestMessageSignature(state, action);
    case PARITY_SIGNER.FINALIZE_SIGNATURE:
      return finalizeSignature(state);
    default:
      return state;
  }
}
