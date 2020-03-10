import { IFormikFields } from 'v2/types/transactionFlow';
import { WithProtectApiFactory } from './withProtectStateFactory';

export type SendFormCallbackType = () => { isValid: boolean; values: IFormikFields | null };
export interface WithProtectApi {
  withProtectApi?: WithProtectApiFactory;
}

export enum ProtectTxError {
  NO_ERROR,
  INSUFFICIENT_DATA,
  LESS_THAN_MIN_AMOUNT,
  ETH_ONLY
}
