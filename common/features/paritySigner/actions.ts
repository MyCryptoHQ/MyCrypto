import {
  PARITY_SIGNER,
  RequestTransactionSignatureAction,
  RequestMessageSignatureAction,
  FinalizeSignatureAction
} from './types';

export type TRequestTransactionSignature = typeof requestTransactionSignature;
export function requestTransactionSignature(
  from: string,
  data: string
): RequestTransactionSignatureAction {
  return {
    type: PARITY_SIGNER.REQUEST_TX_SIGNATURE,
    payload: {
      isMessage: false,
      from,
      data
    }
  };
}

export type TRequestMessageSignature = typeof requestMessageSignature;
export function requestMessageSignature(from: string, data: string): RequestMessageSignatureAction {
  return {
    type: PARITY_SIGNER.REQUEST_MSG_SIGNATURE,
    payload: {
      isMessage: true,
      from,
      data
    }
  };
}

export type TFinalizeSignature = typeof finalizeSignature;
export function finalizeSignature(signature: string | null): FinalizeSignatureAction {
  return {
    type: PARITY_SIGNER.FINALIZE_SIGNATURE,
    payload: signature
  };
}
