import * as types from './actionTypes';
import { TypeKeys } from './constants';

export type TRequestSignature = typeof requestSignature;
export function requestSignature(from: string, rlp: string): types.RequestSignatureAction {
  return {
    type: TypeKeys.PARITY_SIGNER_REQUEST_SIGNATURE,
    payload: {
      from,
      rlp
    }
  };
}

export type TFinalizeSignature = typeof finalizeSignature;
export function finalizeSignature(signature: string | null): types.FinalizeSignatureAction {
  return {
    type: TypeKeys.PARITY_SIGNER_FINALIZE_SIGNATURE,
    payload: signature
  };
}
