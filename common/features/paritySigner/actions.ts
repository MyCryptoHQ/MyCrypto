import * as types from './types';

export type TRequestTransactionSignature = typeof requestTransactionSignature;
export function requestTransactionSignature(
  from: string,
  data: string
): types.RequestTransactionSignatureAction {
  return {
    type: types.ParitySignerActions.REQUEST_TX_SIGNATURE,
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
    type: types.ParitySignerActions.REQUEST_MSG_SIGNATURE,
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
    type: types.ParitySignerActions.FINALIZE_SIGNATURE,
    payload: signature
  };
}
