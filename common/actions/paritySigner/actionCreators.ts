import * as types from './actionTypes';
import { TypeKeys } from './constants';

export type TRequestTransactionSignature = typeof requestTransactionSignature;
export function requestTransactionSignature(
  from: string,
  data: string
): types.RequestTransactionSignatureAction {
  return {
    type: TypeKeys.PARITY_SIGNER_REQUEST_TX_SIGNATURE,
    payload: {
      isMessage: false,
      from,
      data
    }
  };
}

export type TRequestMessageSignature = typeof requestMessageSignature;
export function requestMessageSignature(
  from: string,
  data: string
): types.RequestMessageSignatureAction {
  return {
    type: TypeKeys.PARITY_SIGNER_REQUEST_MSG_SIGNATURE,
    payload: {
      isMessage: true,
      from,
      data
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
