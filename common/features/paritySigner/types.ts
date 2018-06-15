export interface ParitySignerState {
  requested?: QrSignatureState | null;
}

interface QrSignatureState {
  isMessage: boolean;
  from: string;
  data: string;
}

export enum ParitySignerActions {
  REQUEST_TX_SIGNATURE = 'PARITY_SIGNER_REQUEST_TX_SIGNATURE',
  REQUEST_MSG_SIGNATURE = 'PARITY_SIGNER_REQUEST_MSG_SIGNATURE',
  FINALIZE_SIGNATURE = 'PARITY_SIGNER_FINALIZE_SIGNATURE'
}

export interface RequestTransactionSignatureAction {
  type: ParitySignerActions.REQUEST_TX_SIGNATURE;
  payload: {
    isMessage: false;
    data: string;
    from: string;
  };
}

export interface RequestMessageSignatureAction {
  type: ParitySignerActions.REQUEST_MSG_SIGNATURE;
  payload: {
    isMessage: true;
    data: string;
    from: string;
  };
}

export interface FinalizeSignatureAction {
  type: ParitySignerActions.FINALIZE_SIGNATURE;
  payload: string | null;
}

export type ParitySignerAction =
  | RequestTransactionSignatureAction
  | RequestMessageSignatureAction
  | FinalizeSignatureAction;
