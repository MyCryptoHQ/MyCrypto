import {
  ParitySignerAction,
  RequestTransactionSignatureAction,
  RequestMessageSignatureAction,
  TypeKeys
} from 'actions/paritySigner';

export interface State {
  requested?: QrSignatureState | null;
}

interface QrSignatureState {
  isMessage: boolean;
  from: string;
  data: string;
}

export const INITIAL_STATE: State = {
  requested: null
};

function requestTransactionSignature(
  state: State,
  action: RequestTransactionSignatureAction
): State {
  return {
    ...state,
    requested: action.payload
  };
}

function requestMessageSignature(state: State, action: RequestMessageSignatureAction): State {
  return {
    ...state,
    requested: action.payload
  };
}

function finalizeSignature(state: State): State {
  return {
    ...state,
    requested: null
  };
}

export function paritySigner(state: State = INITIAL_STATE, action: ParitySignerAction): State {
  switch (action.type) {
    case TypeKeys.PARITY_SIGNER_REQUEST_TX_SIGNATURE:
      return requestTransactionSignature(state, action);
    case TypeKeys.PARITY_SIGNER_REQUEST_MSG_SIGNATURE:
      return requestMessageSignature(state, action);
    case TypeKeys.PARITY_SIGNER_FINALIZE_SIGNATURE:
      return finalizeSignature(state);
    default:
      return state;
  }
}
