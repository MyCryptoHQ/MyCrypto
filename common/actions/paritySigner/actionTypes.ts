import { TypeKeys } from './constants';

export interface RequestTransactionSignatureAction {
  type: TypeKeys.PARITY_SIGNER_REQUEST_TX_SIGNATURE;
  payload: {
    isMessage: false;
    data: string;
    from: string;
  };
}

export interface RequestMessageSignatureAction {
  type: TypeKeys.PARITY_SIGNER_REQUEST_MSG_SIGNATURE;
  payload: {
    isMessage: true;
    data: string;
    from: string;
  };
}

export interface FinalizeSignatureAction {
  type: TypeKeys.PARITY_SIGNER_FINALIZE_SIGNATURE;
  payload: string | null;
}

/*** Union Type ***/
export type ParitySignerAction =
  | RequestTransactionSignatureAction
  | RequestMessageSignatureAction
  | FinalizeSignatureAction;
