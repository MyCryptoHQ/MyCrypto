import { IFormikFields } from 'v2/types/transactionFlow';

export type SendFormCallbackType = () => { isValid: boolean; values: IFormikFields | null };
