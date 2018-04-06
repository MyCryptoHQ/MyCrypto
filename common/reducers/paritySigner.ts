import { RequestSignatureAction } from 'actions/paritySigner/actionTypes';
import { ParitySignerAction, TypeKeys } from 'actions/paritySigner';

export interface State {
  requested?: QrSignatureState | null;
}

interface QrSignatureState {
  from: string;
  rlp: string;
}

export const INITIAL_STATE: State = {
  requested: null
};

function requestSignature(state: State, action: RequestSignatureAction): State {
  return {
    ...state,
    requested: action.payload
  };
}

function finalize(state: State): State {
  return {
    ...state,
    requested: null
  };
}

export function paritySigner(state: State = INITIAL_STATE, action: ParitySignerAction): State {
  switch (action.type) {
    case TypeKeys.PARITY_SIGNER_REQUEST_SIGNATURE:
      return requestSignature(state, action);
    case TypeKeys.PARITY_SIGNER_FINALIZE:
      return finalize(state);
    default:
      return state;
  }
}
