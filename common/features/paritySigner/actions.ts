import * as paritySignerTypes from './types';

export type TRequestTransactionSignature = typeof requestTransactionSignature;
export function requestTransactionSignature(
  from: string,
  data: string
): paritySignerTypes.RequestTransactionSignatureAction {
  return {
    type: paritySignerTypes.ParitySignerActions.REQUEST_TX_SIGNATURE,
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
): paritySignerTypes.RequestMessageSignatureAction {
  return {
    type: paritySignerTypes.ParitySignerActions.REQUEST_MSG_SIGNATURE,
    payload: {
      isMessage: true,
      from,
      data
    }
  };
}

export type TFinalizeSignature = typeof finalizeSignature;
export function finalizeSignature(
  signature: string | null
): paritySignerTypes.FinalizeSignatureAction {
  return {
    type: paritySignerTypes.ParitySignerActions.FINALIZE_SIGNATURE,
    payload: signature
  };
}
