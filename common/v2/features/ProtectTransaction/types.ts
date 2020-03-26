import { IFormikFields } from 'v2/types/transactionFlow';
import { WithProtectTxApiFactory } from './withProtectStateFactory';

export type SendFormCallbackType = () => { isValid: boolean; values: IFormikFields | null };
export interface IWithProtectApi {
  withProtectApi?: WithProtectTxApiFactory;
}

export enum ProtectTxError {
  NO_ERROR,
  INSUFFICIENT_DATA,
  LESS_THAN_MIN_AMOUNT,
  ETH_ONLY
}
