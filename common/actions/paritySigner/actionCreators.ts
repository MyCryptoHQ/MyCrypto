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

export type TFinalize = typeof finalize;
export function finalize(signature: string | null): types.FinalizeAction {
  return {
    type: TypeKeys.PARITY_SIGNER_FINALIZE,
    payload: signature
  };
}
