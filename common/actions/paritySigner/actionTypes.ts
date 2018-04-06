import { TypeKeys } from './constants';

export interface RequestSignatureAction {
  type: TypeKeys.PARITY_SIGNER_REQUEST_SIGNATURE;
  payload: {
    rlp: string;
    from: string;
  };
}

export interface FinalizeAction {
  type: TypeKeys.PARITY_SIGNER_FINALIZE;
  payload: string | null;
}

/*** Union Type ***/
export type ParitySignerAction = RequestSignatureAction | FinalizeAction;
