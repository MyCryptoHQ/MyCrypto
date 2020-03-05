import { IFormikFields } from 'v2/types/transactionFlow';
import { WithProtectApiFactory } from './withProtectStateFactory';

export type SendFormCallbackType = () => { isValid: boolean; values: IFormikFields | null };
export interface WithProtectApi {
  withProtectApi?: WithProtectApiFactory;
}
